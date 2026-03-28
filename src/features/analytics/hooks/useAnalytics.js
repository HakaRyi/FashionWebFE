import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../api/analyticsApi';

export const useAnalytics = (period = '30d') => {
    // 1. Khởi tạo State đồng nhất với cấu trúc Backend trả về
    const [data, setData] = useState({
        stats: [],
        topEvents: [],
        chartData: [],
        loading: true,
        error: null
    });

    // 2. Định nghĩa hàm fetch dữ liệu (Dùng useCallback để tối ưu hiệu năng)
    const fetchAnalytics = useCallback(async (isMounted) => {
        try {
            setData(prev => ({ ...prev, loading: true, error: null }));
            
            // Gọi Service Class
            const result = await analyticsApi.getExpertDashboard(period);
            
            if (isMounted) {
                setData({
                    stats: result.stats || [],
                    topEvents: result.topEvents || [],
                    chartData: result.chartData || [],
                    loading: false,
                    error: null
                });
            }
        } catch (err) {
            if (isMounted) {
                const message = err.response?.data?.message || "Không thể tải dữ liệu Dashboard.";
                setData(prev => ({ 
                    ...prev, 
                    loading: false, 
                    error: message 
                }));
            }
        }
    }, [period]);

    useEffect(() => {
        let isMounted = true;
        
        fetchAnalytics(isMounted);

        return () => {
            isMounted = false;
        };
    }, [fetchAnalytics]);

    return {
        ...data,
        refresh: () => fetchAnalytics(true)
    };
};