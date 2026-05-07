import { useState, useEffect, useMemo, useCallback } from 'react';
import { financialApi } from '../api/financialApi';
import { eventApi } from '@/features/events';
import { toast } from 'react-hot-toast';

export const useAdminFinancial = () => {
    const [activeTab, setActiveTab] = useState('all-transactions');
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCampaignPickerOpen, setIsCampaignPickerOpen] = useState(false);
    const [campaignSearch, setCampaignSearch] = useState('');

    const [data, setData] = useState([]);
    const [escrowList, setEscrowList] = useState([]);
    const [eventList, setEventList] = useState([]);

    const [filters, setFilters] = useState({
        type: '',
        refType: '',
        eventId: '',
        searchBy: 'all',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const fetchEvents = useCallback(async () => {
        try {
            const res = await eventApi.getAllAdmin();
            setEventList(res.data || []);
        } catch (error) {
            console.error('Failed to fetch events for filter:', error);
        }
    }, []);

    const fetchAdminData = useCallback(async () => {
        setIsLoading(true);

        try {
            if (activeTab === 'all-transactions') {
                const res = await financialApi.getAllTransactionsAdmin({
                    type: filters.type,
                    refType: filters.refType,
                    search: searchTerm,
                    searchBy: filters.searchBy || 'all',
                });

                setData(res.data || []);
            } else if (activeTab === 'escrow-fix') {
                const res = await financialApi.getEscrowManagementAdmin();

                setEscrowList(res.data || []);
            }
        } catch (error) {
            toast.error('Không thể kết nối máy chủ tài chính.');
        } finally {
            setIsLoading(false);
        }
    }, [
        activeTab,
        filters.type,
        filters.refType,
        filters.searchBy,
        searchTerm,
    ]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAdminData();
            setCurrentPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [fetchAdminData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchTerm,
        filters.eventId,
        filters.type,
        filters.refType,
        filters.searchBy,
        activeTab,
    ]);

    const handleAdminRequestFix = async (escrowId, reason) => {
        if (!reason.trim()) {
            return toast.error('Please enter a specific reason.');
        }

        setIsActionLoading(true);

        try {
            await financialApi.adminRequestFix(escrowId, reason);
            toast.success('The approval request has been sent to the Expert.');
            await fetchAdminData();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    'Request submission error. Please try again.',
            );
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

    const filteredData = useMemo(() => {
        let list = activeTab === 'all-transactions' ? data : escrowList;

        if (filters.eventId) {
            list = list.filter((item) => {
                if (activeTab === 'all-transactions') {
                    const isEventTransaction =
                        item.referenceType === 'Event' ||
                        item.referenceType === 'EventFix';

                    return (
                        isEventTransaction &&
                        String(item.referenceId || '') === String(filters.eventId)
                    );
                }

                if (activeTab === 'escrow-fix') {
                    return String(item.eventId || '') === String(filters.eventId);
                }

                return false;
            });
        }

        if (activeTab === 'escrow-fix' && searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase();

            list = list.filter((item) => {
                return (
                    item.eventTitle?.toLowerCase().includes(lowerSearch) ||
                    item.receiverName?.toLowerCase().includes(lowerSearch) ||
                    item.senderName?.toLowerCase().includes(lowerSearch) ||
                    item.userName?.toLowerCase().includes(lowerSearch) ||
                    item.description?.toLowerCase().includes(lowerSearch) ||
                    item.orderCode?.toLowerCase().includes(lowerSearch) ||
                    String(item.orderId || '').includes(lowerSearch) ||
                    String(item.eventId || '').includes(lowerSearch) ||
                    String(item.escrowSessionId || '').includes(lowerSearch) ||
                    String(item.id || '').includes(lowerSearch)
                );
            });
        }

        return list;
    }, [
        activeTab,
        data,
        escrowList,
        filters.eventId,
        searchTerm,
    ]);

    const filteredEventList = useMemo(() => {
        return eventList.filter((ev) =>
            ev.title.toLowerCase().includes(campaignSearch.toLowerCase()),
        );
    }, [eventList, campaignSearch]);

    const currentTableData = useMemo(() => {
        const total = filteredData.length;
        const maxPage = Math.ceil(total / rowsPerPage) || 1;
        const safePage = currentPage > maxPage ? 1 : currentPage;
        const start = (safePage - 1) * rowsPerPage;

        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return {
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

        eventList,
        filteredEventList,

        currentTableData,
        totalCount: filteredData.length,
        totalPages,
        currentPage,
        setCurrentPage,

        handleAdminRequestFix,
        handleAdminExecute,
        refreshData: fetchAdminData,
    };
};