import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { getEventApi } from '@/features/events';
import { financialApi } from '../api/financialApi';

export const useEventFinancials = (eventId) => {
    const { user } = useAuth();
    const CURRENT_EXPERT_USER = user?.username;

    const [data, setData] = useState({
        eventInfo: null,
        transactions: [],
        metrics: { totalRevenue: 0, totalExpense: 0, netProfit: 0, totalRefund: 0 },
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEventFinancials = async () => {
            if (!eventId || !CURRENT_EXPERT_USER) return;

            setLoading(true);
            try {
                const [eventRes, transRes] = await Promise.all([
                    getEventApi.getEventDetail(eventId),
                    financialApi.getTransactionsByReference('Event', eventId),
                ]);

                // 1. Khai báo là allTransactions
                const allTransactions = transRes.data || [];

                const expertTxs = allTransactions.filter((t) => t.userName === CURRENT_EXPERT_USER);

                /**
                 * PHÂN TÍCH TÀI CHÍNH CHI TIẾT:
                 * 1. Revenue: Chỉ tính các khoản tiền vé thực thu (Released). Không tính Refund.
                 * 2. Gross Expense: Tổng các khoản đã chi (Phí hệ thống + Tiền escrow giải thưởng).
                 * 3. Refund: Tiền dư từ escrow trả về ví.
                 */

                const totalRevenue = expertTxs
                    .filter((t) => t.type.includes('Revenue_Released'))
                    .reduce((sum, t) => sum + t.amount, 0);

                const totalRefund = expertTxs
                    .filter((t) => t.type.includes('Refund'))
                    .reduce((sum, t) => sum + t.amount, 0);

                const grossExpense = expertTxs
                    .filter((t) => t.amount < 0)
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

                // Chi phí thực tế = Số đã chi - Số được trả lại
                const netExpense = grossExpense - totalRefund;

                setData({
                    eventInfo: eventRes.data,
                    transactions: allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                    metrics: {
                        totalRevenue,
                        totalExpense: netExpense,
                        totalRefund,
                        netProfit: totalRevenue - netExpense,
                    },
                });
            } catch (err) {
                console.error('Financial Data Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventFinancials();
    }, [eventId, CURRENT_EXPERT_USER]);

    // Xử lý dữ liệu biểu đồ 3 cột: Thu - Chi - Hoàn
    const chartAnalysis = useMemo(() => {
        const dailyMap = {};
        data.transactions
            .filter((t) => t.userName === CURRENT_EXPERT_USER)
            .forEach((t) => {
                const date = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                if (!dailyMap[date]) dailyMap[date] = { date, income: 0, expense: 0, refund: 0 };

                if (t.type.includes('Refund')) {
                    dailyMap[date].refund += t.amount;
                } else if (t.amount > 0) {
                    // Chỉ tính doanh thu thực tế, loại bỏ các giao dịch "Locked" nếu có để tránh ảo
                    if (t.type.includes('Revenue_Released')) {
                        dailyMap[date].income += t.amount;
                    }
                } else {
                    dailyMap[date].expense += Math.abs(t.amount);
                }
            });

        // Sắp xếp theo thời gian tăng dần để biểu đồ chạy từ trái sang phải
        return Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [data.transactions, CURRENT_EXPERT_USER]);

    const filteredList = useMemo(() => {
        return (data.transactions || []).filter((t) => {
            const matchesTab =
                activeTab === 'all' ||
                (activeTab === 'my_tx' && t.userName === CURRENT_EXPERT_USER) ||
                (activeTab === 'participants' && t.userName !== CURRENT_EXPERT_USER && t.userName !== 'admin');

            const matchesSearch =
                (t.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (t.userName?.toLowerCase() || '').includes(searchQuery.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery, data.transactions, CURRENT_EXPERT_USER]);

    return {
        eventInfo: data.eventInfo,
        metrics: data.metrics,
        loading: loading || !user,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        chartAnalysis,
        filteredList,
        currentUser: CURRENT_EXPERT_USER,
    };
};
