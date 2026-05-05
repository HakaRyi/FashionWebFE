import { useState, useEffect, useMemo, useCallback } from 'react';
import { financialApi } from '../api/financialApi';
import { eventApi } from '@/features/events';
import { toast } from 'react-hot-toast';

export const useAdminFinancial = () => {
    // 1. Core States
    const [activeTab, setActiveTab] = useState('all-transactions');
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCampaignPickerOpen, setIsCampaignPickerOpen] = useState(false);
    const [campaignSearch, setCampaignSearch] = useState('');

    // 2. Data States
    const [data, setData] = useState([]); // Transactions
    const [escrowList, setEscrowList] = useState([]);
    const [eventList, setEventList] = useState([]); // Danh sách sự kiện từ API Admin

    // 3. Filter States
    const [filters, setFilters] = useState({
        type: '', // Credit | Debit
        refType: '', // Event | Withdrawal
        eventId: '', // Lọc theo sự kiện cụ thể
    });

    // 4. Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    /**
     * Lấy danh sách sự kiện cho bộ lọc (Chỉ gọi 1 lần khi mount)
     */
    const fetchEvents = useCallback(async () => {
        try {
            const res = await eventApi.getAllAdmin();
            setEventList(res.data || []);
        } catch (error) {
            console.error('Failed to fetch events for filter:', error);
        }
    }, []);

    /**
     * Lấy dữ liệu tài chính chính
     */
    const fetchAdminData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'all-transactions') {
                const res = await financialApi.getAllTransactionsAdmin(filters.type, filters.refType);
                setData(res.data || []);
            } else if (activeTab === 'escrow-fix') {
                const res = await financialApi.getEscrowManagementAdmin();
                setEscrowList(res.data || []);
            }
            // Nếu có thêm tab 'event-summary', xử lý ở đây
        } catch (error) {
            toast.error('Không thể kết nối máy chủ tài chính.');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, filters.type, filters.refType]);

    // Khởi tạo dữ liệu
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        fetchAdminData();
        setCurrentPage(1);
    }, [fetchAdminData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters.eventId, filters.type, filters.refType]);

    /**
     * Các hàm nghiệp vụ (Actions)
     */
    const handleAdminRequestFix = async (escrowId, reason) => {
        if (!reason.trim()) return toast.error('Please enter a specific reason.');
        setIsActionLoading(true);
        try {
            await financialApi.adminRequestFix(escrowId, reason);
            toast.success('The approval request has been sent to the Expert.');
            await fetchAdminData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Request submission error. Please try again.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleAdminExecute = async (escrowId) => {
        setIsActionLoading(true);
        try {
            await financialApi.adminExecuteFix(escrowId);
            toast.success('The escrow has been executed successfully!');
            await fetchAdminData();
        } catch (error) {
            toast.error('Failed to execute the escrow. The Expert may not have approved it.');
        } finally {
            setIsActionLoading(false);
        }
    };

    /**
     * Logic Lọc và Tìm kiếm (Multi-layer Filtering)
     */
    const filteredData = useMemo(() => {
        // Lấy danh sách gốc dựa trên tab
        let list = activeTab === 'all-transactions' ? data : escrowList;

        // Layer 1: Lọc theo Event ID (Nếu có chọn trong Select)
        if (filters.eventId) {
            list = list.filter(
                (item) =>
                    String(item.referenceId) === String(filters.eventId) ||
                    String(item.eventId) === String(filters.eventId),
            );
        }

        // Layer 2: Search theo text (Code, Name, Desc, Title)
        if (searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase();
            list = list.filter(
                (item) =>
                    item.transactionCode?.toLowerCase().includes(lowerSearch) ||
                    item.userName?.toLowerCase().includes(lowerSearch) ||
                    item.description?.toLowerCase().includes(lowerSearch) ||
                    item.eventTitle?.toLowerCase().includes(lowerSearch) ||
                    item.receiverName?.toLowerCase().includes(lowerSearch),
            );
        }

        return list;
    }, [data, escrowList, searchTerm, activeTab, filters.eventId]);

    const filteredEventList = useMemo(() => {
        return eventList.filter((ev) => ev.title.toLowerCase().includes(campaignSearch.toLowerCase()));
    }, [eventList, campaignSearch]);

    /**
     * Logic Phân trang
     */
    const currentTableData = useMemo(() => {
        const total = filteredData.length;
        const maxPage = Math.ceil(total / rowsPerPage) || 1;

        const safePage = currentPage > maxPage ? 1 : currentPage;

        const start = (safePage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return {
        // States
        activeTab,
        setActiveTab,
        isLoading,
        isActionLoading,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        setIsCampaignPickerOpen,
        isCampaignPickerOpen,
        campaignSearch,
        setCampaignSearch,


        // Data
        eventList, // Để render Select chọn sự kiện
        filteredEventList, // Danh sách sự kiện đã lọc
        currentTableData, // Data đã lọc và phân trang
        totalCount: filteredData.length,
        totalPages,
        currentPage,
        setCurrentPage,

        // Actions
        handleAdminRequestFix,
        handleAdminExecute,
        refreshData: fetchAdminData,
    };
};
