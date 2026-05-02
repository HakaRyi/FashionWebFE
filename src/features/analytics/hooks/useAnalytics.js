import { useState, useEffect, useCallback, useMemo } from 'react';
import { analyticsApi } from '../api/analyticsApi';

export const useAnalytics = () => {
    // --- Helper Logic cho Date ---
    const formatDate = (date) => date.toISOString().split('T')[0];

    // Tạo các mốc ngày cố định để dùng so sánh class 'active' ở UI
    const dates = useMemo(() => {
        const today = new Date();
        const d30 = new Date();
        d30.setDate(today.getDate() - 30);
        const d90 = new Date();
        d90.setDate(today.getDate() - 90);

        return {
            today: formatDate(today),
            last30: formatDate(d30),
            last90: formatDate(d90),
        };
    }, []);

    // --- State quản lý ngày ---
    const [startDate, setStartDate] = useState(dates.last30); // Mặc định 30 ngày
    const [endDate, setEndDate] = useState(dates.today);

    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // --- Hàm chọn nhanh (30d, 90d) ---
    const handleFastSelect = useCallback(
        (days) => {
            const newStart = new Date();
            newStart.setDate(new Date().getDate() - days);
            setStartDate(formatDate(newStart));
            setEndDate(dates.today);
        },
        [dates.today],
    );

    // --- Fetch Data ---
    // --- Fetch Data ---
    const fetchAnalytics = useCallback(async () => {
        // Dùng biến local để quyết định có hiện skeleton hay không
        // Nếu đã có data thì chỉ hiện mờ (refreshing), nếu chưa có gì thì hiện skeleton (loading)
        const isFirstLoad = !rawData;

        try {
            if (isFirstLoad) {
                setLoading(true);
            } else {
                setIsRefreshing(true);
            }

            setError(null);

            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
            const periodParam = `${diffDays || 1}d`;

            const result = await analyticsApi.getExpertDashboard(periodParam);

            setRawData(result);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.response?.data?.message || 'Unable to load dashboard data.');
        } finally {
            // Đảm bảo tắt cả 2 state cùng lúc
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // --- Xử lý dữ liệu (Processed Data) ---
    const processedData = useMemo(() => {
        if (!rawData || !rawData.events) return { stats: [], topEvents: [], chartData: [] };

        const events = rawData.events;

        // 1. Tính toán Stats
        const totalEntries = events.reduce((sum, e) => sum + e.totalPosts, 0);
        const totalRated = events.reduce((sum, e) => sum + e.posts.filter((p) => p.isRatedByExpert).length, 0);
        const totalEngagement = events.reduce(
            (sum, e) => sum + e.posts.reduce((s, p) => s + (p.likeCount + p.shareCount + p.commentCount), 0),
            0,
        );
        const totalRevenue = events.reduce((sum, e) => sum + e.totalEntryRevenue, 0);

        const stats = [
            { label: 'Total number of entries', value: totalEntries.toLocaleString() },
            { label: 'Progress in grading', value: `${totalRated}/${totalEntries}` },
            { label: 'Community engagement', value: totalEngagement.toLocaleString() },
            { label: 'Event creation costs', value: `${totalRevenue.toLocaleString()} VND` },
        ];

        // 2. Tính toán Top Events
        const topEvents = events
            .map((e) => ({
                id: e.eventId,
                title: e.title,
                posts: e.totalPosts,
                rated: e.posts.filter((p) => p.isRatedByExpert).length,
                engagements: e.posts.reduce((s, p) => s + (p.likeCount || 0) + (p.shareCount || 0), 0),
            }))
            .sort((a, b) => b.posts - a.posts)
            .slice(0, 5);

        // 3. Tính toán Chart Data
        const dateMap = {};
        events.forEach((e) => {
            e.posts.forEach((p) => {
                const date = new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
                if (!dateMap[date]) dateMap[date] = { date, submissions: 0, engagements: 0 };
                dateMap[date].submissions += 1;
                dateMap[date].engagements += (p.likeCount || 0) + (p.shareCount || 0) + (p.commentCount || 0);
            });
        });

        const chartData = Object.values(dateMap).sort((a, b) => {
            const [d1, m1] = a.date.split('/');
            const [d2, m2] = b.date.split('/');
            return new Date(2026, m1 - 1, d1) - new Date(2026, m2 - 1, d2);
        });

        return { stats, topEvents, chartData };
    }, [rawData]);

    return {
        ...processedData,
        loading,
        isRefreshing,
        error,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        handleFastSelect,
        dates,
        refresh: fetchAnalytics,
    };
};
