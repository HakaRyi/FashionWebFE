import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/routes/paths';
import { financialApi } from '../api/financialApi';

export const useFinancialManagement = () => {
    const navigate = useNavigate();

    // --- UI State ---
    const [activeTab, setActiveTab] = useState('history'); // history | events | reconciliation
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

    // --- 1. Fetching Logic ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            let response;
            switch (activeTab) {
                case 'history':
                    response = await financialApi.getWalletHistory();
                    setTransactionHistory(response.data || []);
                    break;
                case 'events':
                    response = await financialApi.getMyCreatedEvents();
                    setManagedEvents(response.data || []);
                    break;
                case 'reconciliation':
                    response = await financialApi.getEscrowManagement();
                    const list = response.data || [];
                    setReconciliationList(list.filter((item) => item.status === 'PendingFix'));
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Financial Data Fetch Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reset trang khi thay đổi filter hoặc tab
    useEffect(() => {
        setCurrentPage(1);
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

        let filtered = [...transactionHistory];

        // Lọc theo ngày nếu có chọn range
        if (dateRange.startDate && dateRange.endDate) {
            const start = new Date(dateRange.startDate).getTime();
            const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

            filtered = filtered.filter((item) => {
                const time = new Date(item.createdAt).getTime();
                return time >= start && time <= end;
            });
        }

        // Sắp xếp cũ -> mới để tính tích lũy
        const sortedData = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        let cumulativeRevenue = 0;
        const dailyDataMap = new Map();

        sortedData.forEach((item) => {
            const isRefund = item.type?.includes('Event_Refund') || item.type?.includes('Event_Cancel_Refund');

            if (item.amount > 0 && !isRefund) {
                cumulativeRevenue += item.amount;
            }

            const dateKey = new Date(item.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
            });

            // Lấy giá trị cuối cùng của ngày
            dailyDataMap.set(dateKey, cumulativeRevenue);
        });

        return Array.from(dailyDataMap, ([date, value]) => ({ date, value }));
    }, [transactionHistory, dateRange]);

    // --- 4. Tổng hợp thông tin tài chính ---
    const financialSummary = useMemo(() => {
        const now = new Date();
        return {
            availableBalance: transactionHistory.length > 0 ? transactionHistory[0].balanceAfter : 0,
            totalManagedEvents: managedEvents.length,
            pendingReconciliations: reconciliationList.length,
            monthlyRevenue: transactionHistory
                .filter((t) => {
                    const tDate = new Date(t.createdAt);

                    const isRealRevenue =
                        t.amount > 0 && !t.type?.includes('Event_Refund') && !t.type?.includes('Event_Cancel_Refund');

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
            fetchData();
        } catch (error) {
            console.error('Escrow Approval Error:', error);
        }
    };

    const handleEventClick = (event) => {
        const id = event.eventId || event.id;
        navigate(PATHS.EXPERT_FINANCIAL_EVENT.replace(':eventId', id));
    };

    return {
        // States
        showScrollTop,
        scrollToTop,
        selectedEvent,
        setSelectedEvent,
        activeTab,
        setActiveTab,
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
