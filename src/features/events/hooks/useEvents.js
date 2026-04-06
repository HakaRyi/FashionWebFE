import { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../api/adminApi';
import { getEventApi } from '../api/getEvent';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await eventApi.getAllAdmin();
            setEvents(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Lỗi fetch events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEventById = async (id) => {
        setIsFetchingDetail(true);
        try {
            const res = await getEventApi.getEventDetail(id);
            return res.data;
        } catch (error) {
            console.error('Lỗi lấy chi tiết:', error);
            return null;
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleApprove = async (id, onSuccess) => {
        try {
            await eventApi.approve(id);
            await fetchEvents();
            onSuccess?.();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Lỗi phê duyệt' };
        }
    };

    const handleReject = async (id, reason, onSuccess) => {
        try {
            await eventApi.reject(id, reason);
            await fetchEvents();
            onSuccess?.();
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Lỗi khi thực hiện lệnh từ chối' };
        }
    };

    const handleUpdate = async (id, dto) => {
        try {
            await eventApi.updateByAdmin(id, dto);
            await fetchEvents();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Lỗi cập nhật' };
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, fetchEvents, fetchEventById, 
        isFetchingDetail, handleApprove, handleReject, handleUpdate };
};
