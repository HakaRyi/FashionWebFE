import { create } from 'zustand';
import { getEventApi } from '@/features/events';

const initialState = {
    events: [],
    currentEvent: null,
    isLoading: false,
    lastFetched: null,
};

export const useEventStore = create((set, get) => ({
    ...initialState,

    reset: () => set(initialState),

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

    fetchEventDetail: async (eventId, forceRefresh = false) => {
        const { currentEvent } = get();

        if (!forceRefresh && currentEvent?.eventId === eventId) return;

        const existingEvent = get().events.find((e) => e.eventId === eventId);
        if (existingEvent) {
            set({ currentEvent: existingEvent });
        }

        set({ isLoading: true });
        try {
            const response = await getEventApi.getEventDetail(eventId);
            const data = response?.data || response;
            set({
                currentEvent: data,
                isLoading: false,
            });
        } catch (error) {
            console.error('Fetch Detail Error:', error);
            set({ isLoading: false });
        }
    },

    clearCurrentEvent: () => set({ currentEvent: null }),
}));
