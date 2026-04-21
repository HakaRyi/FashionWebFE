import { useState, useEffect, useMemo, useCallback } from 'react';
import { useEventStore } from '../store/useEventStore';

export const usePublicEvents = () => {
    const { events, isLoading, fetchEvents } = useEventStore();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const filteredEvents = useMemo(() => {
        let result = events.filter(event => {
            const matchesSearch = 
                event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const eventTime = new Date(event.startTime).getTime();
            const startLimit = startDate ? new Date(startDate).getTime() : -Infinity;
            const endLimit = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;

            return matchesSearch && (eventTime >= startLimit && eventTime <= endLimit);
        });

        return result.sort((a, b) => {
            const dateA = new Date(a.startTime).getTime();
            const dateB = new Date(b.startTime).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [events, searchTerm, startDate, endDate, sortOrder]);

    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setSortOrder('newest');
    }, []);

    return {
        events: filteredEvents,
        isLoading,
        searchTerm, setSearchTerm,
        startDate, setStartDate,
        endDate, setEndDate,
        sortOrder, setSortOrder,
        resetFilters,
        refreshEvents: () => fetchEvents(true)
    };
};