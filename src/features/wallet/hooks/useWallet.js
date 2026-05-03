import { useState, useEffect, useCallback, useMemo } from 'react';
import { Wallet, Lock, CreditCard } from 'lucide-react';
import { getWalletDashboard } from '@/features/wallet/';
import { format } from 'date-fns';

export const useWallet = ({ itemsPerPage = 5, enabled = true } = {}) => {
    const [walletInfo, setWalletInfo] = useState({ balance: 0, lockedBalance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWalletData = useCallback(async () => {
        if (!enabled) return;

        try {
            setLoading(true);
            setError(null);

            const data = await getWalletDashboard();

            setWalletInfo(data.wallet);
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
    }, [fetchWalletData]);

    const stats = useMemo(
        () => [
            {
                label: 'Available balance',
                value: walletInfo.balance.toLocaleString('vi-VN'),
                sub: 'VND',
                icon: Wallet,
                color: 'blue',
            },
            {
                label: 'Pending withdrawal',
                value: walletInfo.lockedBalance.toLocaleString('vi-VN'),
                sub: 'VND',
                icon: Lock,
                color: 'orange',
            },
        ],
        [walletInfo],
    );

    const chartData = useMemo(() => {
        return transactions
            .slice()
            .reverse() // Đảo ngược để vẽ từ cũ đến mới
            .map((t) => ({
                time: format(new Date(t.createdAt), 'dd/MM'),
                balance: t.balanceAfter,
                amount: t.amount,
            }));
    }, [transactions]);

    const pieData = useMemo(() => {
        const deposit = transactions.filter((t) => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);
        const withdraw = transactions.filter((t) => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0);

        return [
            { name: 'Deposit', value: deposit, fill: '#10b981' },
            { name: 'Withdrawal', value: Math.abs(withdraw), fill: '#ef4444' },
        ];
    }, [transactions]);

    const allFilteredTransactions = useMemo(() => {
        if (filter === 'all') return transactions;
        return transactions.filter((t) => t.referenceType?.toLowerCase() === filter.toLowerCase());
    }, [transactions, filter]);

    const totalPages = Math.ceil(allFilteredTransactions.length / itemsPerPage);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allFilteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [allFilteredTransactions, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    return {
        stats,
        transactions: paginatedTransactions,
        allData: allFilteredTransactions,
        filter,
        setFilter,
        currentPage,
        totalPages,
        setCurrentPage,
        loading,
        error,
        chartData,
        pieData,
        refreshData: fetchWalletData,
    };
};
