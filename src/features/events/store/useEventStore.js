import { create } from 'zustand';
import { getEventApi } from '@/features/events';

export const useEventStore = create((set, get) => ({
    events: [],
    isLoading: false,
    lastFetched: null,

    fetchEvents: async (forceRefresh = false) => {
        const { events, isLoading, lastFetched } = get();

        if (isLoading) return;

        const now = Date.now();
        if (!forceRefresh && events.length > 0 && lastFetched && now - lastFetched < 300000) {
            return;
        }

        set({ isLoading: true });
        try {
            const response = await getEventApi.getAllPublicEvents();
            const data = response?.data || response || [];
            set({
                events: Array.isArray(data) ? data : [],
                lastFetched: now,
                isLoading: false,
            });
        } catch (error) {
            console.error('Event Store Error:', error);
            set({ isLoading: false });
        }
    },
}));
