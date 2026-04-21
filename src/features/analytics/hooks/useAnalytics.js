import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../api/analyticsApi';

export const useAnalytics = (period = '30d') => {
    const [data, setData] = useState({
        stats: [],
        topEvents: [],
        chartData: [],
        loading: true,
        error: null
    });

    const fetchAnalytics = useCallback(async (isMounted) => {
        try {
            setData(prev => ({ ...prev, loading: true, error: null }));
            
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
                const message = err.response?.data?.message || "Unable to load Dashboard data.";
                setData(prev => ({ ...prev, loading: false, error: message }));
            }
        }
    }, [period]);

    useEffect(() => {
        let isMounted = true;
        fetchAnalytics(isMounted);
        return () => { isMounted = false; };
    }, [fetchAnalytics]);

    return { ...data, refresh: () => fetchAnalytics(true) };
};