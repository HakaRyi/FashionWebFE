import { useState, useEffect, useCallback, useMemo } from 'react';
import { Wallet, Lock, ArrowUpRight } from 'lucide-react';
import { getWalletDashboard } from '@/features/wallet/';

const ICON_MAP = {
    Wallet: Wallet,
    Lock: Lock,
    ArrowUpRight: ArrowUpRight,
};

export const useWallet = (itemsPerPage = 5) => {
    const [stats, setStats] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWalletData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getWalletDashboard();

            const mappedStats = (data.stats || []).map((s) => ({
                ...s,
                icon: ICON_MAP[s.icon] || Wallet,
            }));

            setStats(mappedStats);
            setTransactions(data.transactions || []);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu ví:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWalletData();
    }, [fetchWalletData]);

    // 1. Lọc dữ liệu tổng
    const allFilteredTransactions = useMemo(() => {
        return filter === 'all' 
            ? transactions 
            : transactions.filter((t) => t.type?.toLowerCase() === filter.toLowerCase());
    }, [transactions, filter]);

    // 2. Tính toán phân trang dựa trên dữ liệu đã lọc
    const totalPages = Math.ceil(allFilteredTransactions.length / itemsPerPage);
    
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allFilteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [allFilteredTransactions, currentPage, itemsPerPage]);

    // Reset về trang 1 khi đổi filter
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    return {
        stats,
        transactions: paginatedTransactions, // Chỉ trả về data của trang hiện tại để render table
        allData: allFilteredTransactions,    // Trả về toàn bộ data đã lọc để dùng cho Export CSV
        filter,
        setFilter,
        currentPage,
        setCurrentPage,
        totalPages,
        loading,
        error,
        refreshData: fetchWalletData,
    };
};