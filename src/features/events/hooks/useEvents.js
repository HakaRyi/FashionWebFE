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
            console.error('Error fetching events:', error);
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
            console.error('Error fetching event detail:', error);
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
            return { success: false, error: err.response?.data?.message || 'Error approving event' };
        }
    };

    const handleReject = async (id, reason, onSuccess) => {
        try {
            await eventApi.reject(id, reason);
            await fetchEvents();
            onSuccess?.();
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Error when executing the rejection order' };
        }
    };

    const handleUpdate = async (id, dto) => {
        try {
            await eventApi.updateByAdmin(id, dto);
            await fetchEvents();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Error updating event' };
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        events,
        loading,
        fetchEvents,
        fetchEventById,
        isFetchingDetail,
        handleApprove,
        handleReject,
        handleUpdate,
    };
};
