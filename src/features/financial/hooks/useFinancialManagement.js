import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PATHS } from '@/app/routes/paths';
import { financialApi } from '../api/financialApi';

export const useFinancialManagement = () => {
    const navigate = useNavigate();
    const isFirstMount = useRef(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const urlTab = searchParams.get('tab') || 'history';

    // --- UI State ---
    const [activeTab, setActiveTab] = useState(urlTab); // history | events | reconciliation
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all | income | expense
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // --- Data State ---
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [managedEvents, setManagedEvents] = useState([]);
    const [reconciliationList, setReconciliationList] = useState([]);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
    });

    const fetchHistory = useCallback(async () => {
        const res = await financialApi.getWalletHistory();
        setTransactionHistory(res.data || []);
    }, []);

    const fetchEvents = useCallback(async () => {
        const res = await financialApi.getMyCreatedEvents();
        setManagedEvents(res.data || []);
    }, []);

    const fetchEscrow = useCallback(async () => {
        const res = await financialApi.getEscrowManagement();
        const list = res.data || [];
        setReconciliationList(list.filter((item) => item.status === 'PendingFix'));
    }, []);

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            await Promise.all([fetchHistory(), fetchEvents(), fetchEscrow()]);
        } catch (error) {
            console.error('Initial Fetch Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchHistory, fetchEvents, fetchEscrow]);

    // --- 1. Fetching Logic ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'history') await fetchHistory();
            if (activeTab === 'events') await fetchEvents();
            if (activeTab === 'reconciliation') await fetchEscrow();
        } catch (error) {
            console.error('Tab Fetch Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        const currentTabInUrl = searchParams.get('tab') || 'history';
        if (currentTabInUrl !== activeTab) {
            setActiveTab(currentTabInUrl);
        }
    }, [searchParams]);

    const handleTabChange = useCallback(
        (tab) => {
            setActiveTab(tab);
            setSearchParams({ tab });
        },
        [setSearchParams],
    );

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        if (searchTerm || filterType !== 'all') {
            sessionStorage.removeItem('lastEventsPage');
            sessionStorage.removeItem('lastClickedEventId');
            setCurrentPage(1);
            return;
        }

        const savedPage = sessionStorage.getItem('lastEventsPage');
        if (activeTab === 'events' && savedPage) {
            setCurrentPage(parseInt(savedPage, 10));
        } else {
            setCurrentPage(1);
        }
    }, [activeTab, searchTerm, filterType]);

    useEffect(() => {
        const handleScroll = () => {
            // Chỉ cập nhật State nếu giá trị thực sự thay đổi
            const shouldShow = window.scrollY > 400;
            setShowScrollTop((prev) => {
                if (prev !== shouldShow) return shouldShow;
                return prev;
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hàm tiện ích để cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- 2. Xử lý dữ liệu Table (Search & Filter) ---
    const filteredTransactions = useMemo(() => {
        return transactionHistory.filter((transaction) => {
            const description = transaction.description?.toLowerCase() || '';
            const code = transaction.transactionCode?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();

            const matchesSearch = description.includes(search) || code.includes(search);

            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'income' && transaction.amount > 0) ||
                (filterType === 'expense' && transaction.amount < 0);

            return matchesSearch && matchesFilter;
        });
    }, [transactionHistory, searchTerm, filterType]);

    const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

    const currentTableData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredTransactions.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredTransactions, currentPage, rowsPerPage]);

    // --- 3. Xử lý dữ liệu Biểu đồ (Gộp theo ngày & Tích lũy) ---
    const assetDynamicsChartData = useMemo(() => {
        if (!transactionHistory || transactionHistory.length === 0) return [];

        const revenueTransactions = transactionHistory.filter(
            (item) =>
                item.amount > 0 && !item.type?.toLowerCase().includes('refund') && item.type !== 'Event_Revenue_Locked',
        );

        const today = new Date();
        let startDateLabel;
        let endDateLabel;

        if (dateRange.startDate && dateRange.endDate) {
            startDateLabel = new Date(dateRange.startDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
            });
            endDateLabel = new Date(dateRange.endDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
            });
        } else {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            startDateLabel = thirtyDaysAgo.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            endDateLabel = today.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        }

        let filtered = [...revenueTransactions];

        // Lọc theo ngày nếu có chọn range
        if (dateRange.startDate && dateRange.endDate) {
            const start = new Date(dateRange.startDate).getTime();
            const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

            filtered = filtered.filter((item) => {
                const time = new Date(item.createdAt).getTime();
                return time >= start && time <= end;
            });
        }

        if (filtered.length === 0) {
            return [
                { date: startDateLabel, value: 0 },
                { date: endDateLabel, value: 0 },
            ];
        }

        // Sắp xếp cũ -> mới để tính tích lũy
        const sortedData = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        let cumulativeRevenue = 0;
        const finalChartData = [];

        finalChartData.push({ date: startDateLabel, value: 0 });

        sortedData.forEach((item) => {
            cumulativeRevenue += item.amount;

            const dateKey = new Date(item.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
            });

            const lastEntry = finalChartData[finalChartData.length - 1];

            if (lastEntry && lastEntry.date === dateKey) {
                // Nếu cùng ngày, cập nhật giá trị tích lũy mới nhất
                lastEntry.value = cumulativeRevenue;
            } else {
                // Ngày mới, thêm điểm mới vào mảng
                finalChartData.push({ date: dateKey, value: cumulativeRevenue });
            }
        });

        const lastPointDate = finalChartData[finalChartData.length - 1].date;
        if (lastPointDate !== endDateLabel) {
            finalChartData.push({ date: endDateLabel, value: cumulativeRevenue });
        }

        return finalChartData;
    }, [transactionHistory, dateRange]);

    // --- 4. Tổng hợp thông tin tài chính ---
    const financialSummary = useMemo(() => {
        const now = new Date();

        const latestTransaction = [...transactionHistory].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )[0];

        return {
            availableBalance: latestTransaction ? latestTransaction.balanceAfter : 0,
            totalManagedEvents: managedEvents.length,
            pendingReconciliations: reconciliationList.length,
            monthlyRevenue: transactionHistory
                .filter((t) => {
                    const tDate = new Date(t.createdAt);

                    const isRefund = t.type?.toLowerCase().includes('refund') || t.type?.toLowerCase().includes('credit');
                    const isRealRevenue = t.amount > 0 && !isRefund;

                    return (
                        isRealRevenue &&
                        tDate.getMonth() === now.getMonth() &&
                        tDate.getFullYear() === now.getFullYear()
                    );
                })
                .reduce((sum, t) => sum + t.amount, 0),
        };
    }, [transactionHistory, managedEvents, reconciliationList]);

    // --- 5. Helper & Action Handlers ---
    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatYAxis = (value) => {
        if (value >= 1000) return `${(value / 1000).toLocaleString('vi-VN')}k`;
        return value.toLocaleString('vi-VN');
    };

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) return;

        const headers = ['Ngày', 'Nội dung', 'Mã giao dịch', 'Số tiền', 'Số dư sau GD'];
        const rows = filteredTransactions.map((t) => [
            new Date(t.createdAt).toLocaleString('vi-VN'),
            t.description?.replace(/,/g, ' '), // Tránh lỗi dấu phẩy trong CSV
            t.transactionCode,
            t.amount,
            t.balanceAfter,
        ]);

        // Thêm BOM \ufeff để Excel nhận diện được tiếng Việt (UTF-8)
        const csvContent = '\ufeff' + headers.join(',') + '\n' + rows.map((e) => e.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Bao_cao_tai_chinh_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleApproveEscrow = async (escrowId) => {
        try {
            await financialApi.approveEscrow(escrowId);
            fetchAllData();
        } catch (error) {
            console.error('Escrow Approval Error:', error);
        }
    };

    const handleEventClick = useCallback(
        (event) => {
            sessionStorage.setItem('lastEventsPage', currentPage.toString());

            const targetPath = PATHS.EXPERT_FINANCIAL_EVENT.replace(':eventId', event.eventId);
            navigate(targetPath);
        },
        [currentPage, navigate],
    );

    const filteredEvents = useMemo(() => {
        return managedEvents.filter((event) => event.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [managedEvents, searchTerm]);

    // 2. Cắt dữ liệu Event theo trang hiện tại
    const currentEventsData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredEvents.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredEvents, currentPage, rowsPerPage]);

    // 3. Tính toán lại totalPages dựa trên tab đang active
    const dynamicTotalPages = useMemo(() => {
        const totalItems = activeTab === 'events' ? filteredEvents.length : filteredTransactions.length;
        return Math.ceil(totalItems / rowsPerPage);
    }, [activeTab, filteredEvents.length, filteredTransactions.length, rowsPerPage]);

    return {
        // States
        showScrollTop,
        scrollToTop,
        selectedEvent,
        setSelectedEvent,
        activeTab,
        setActiveTab: handleTabChange,
        isLoading,
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        totalPages,
        dateRange,
        setDateRange,

        // Data
        currentTableData,
        currentEventsData,
        totalPages: dynamicTotalPages,
        totalItems: activeTab === 'events' ? filteredEvents.length : filteredTransactions.length,
        assetDynamicsChartData,
        financialSummary,
        managedEvents,
        reconciliationList,
        filteredTransactions,

        // Handlers & Helpers
        handleExportCSV,
        handleApproveEscrow,
        handleEventClick,
        formatVND,
        formatYAxis,
        fetchData,
    };
};
