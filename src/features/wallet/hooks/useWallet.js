import { useState, useEffect, useCallback, useMemo } from 'react';
import { Wallet, Lock, ArrowUpRight } from 'lucide-react';
import { getWalletDashboard } from '@/features/wallet/';

const ICON_MAP = {
    Wallet: Wallet,
    Lock: Lock,
    ArrowUpRight: ArrowUpRight,
};

export const useWallet = ({ itemsPerPage = 5, enabled = true } = {}) => {
    const [stats, setStats] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWalletData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token || !enabled) return;

        try {
            setLoading(true);
            setError(null);

            // Gọi API Dashboard
            const data = await getWalletDashboard();

            // 1. Map Icon cho Stats
            const mappedStats = (data.stats || []).map((s) => ({
                ...s,
                icon: ICON_MAP[s.icon] || Wallet,
            }));

            // 2. Set thẳng dữ liệu vào state vì Backend đã format chuẩn xác
            setStats(mappedStats);
            setTransactions(data.transactions || []);
        } catch (err) {
            console.error('Error retrieving wallet data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        fetchWalletData();
    }, [fetchWalletData, enabled]);

    // Lọc dữ liệu theo filter (all, deposit, expense)
    const allFilteredTransactions = useMemo(() => {
        if (filter === 'all') return transactions;
        return transactions.filter((t) => t.type?.toLowerCase() === filter.toLowerCase());
    }, [transactions, filter]);

    const totalPages = Math.ceil(allFilteredTransactions.length / itemsPerPage);

    // Tính toán dữ liệu hiển thị cho trang hiện tại
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allFilteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [allFilteredTransactions, currentPage, itemsPerPage]);

    // Reset về trang 1 mỗi khi đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    return {
        stats,
        transactions: paginatedTransactions,
        allData: allFilteredTransactions, // Dùng cho Export CSV
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
