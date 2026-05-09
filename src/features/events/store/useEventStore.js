import { create } from 'zustand';
import { getEventApi } from '@/features/events';

const initialState = {
    events: [],
    currentEvent: null,
    isLoading: false,
    lastFetched: null,
    error: null,
};

export const useEventStore = create((set, get) => ({
    ...initialState,

    reset: () => set(initialState),

    updateEventInStore: (updatedEvent) => {
        const { events, currentEvent } = get();

        const newEvents = events.map((e) => (e.eventId === updatedEvent.eventId ? { ...e, ...updatedEvent } : e));

        const newCurrent =
            currentEvent?.eventId === updatedEvent.eventId ? { ...currentEvent, ...updatedEvent } : currentEvent;

        set({ events: newEvents, currentEvent: newCurrent });
    },

    fetchEvents: async (forceRefresh = false) => {
        const { events, isLoading, lastFetched } = get();

        if (isLoading && !forceRefresh) return;

        const now = Date.now();
        if (!forceRefresh && events.length > 0 && lastFetched && now - lastFetched < 60000) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await getEventApi.getAllPublicEvents();
            const data = response?.data || response || [];
            set({
                events: Array.isArray(data) ? data : [],
                lastFetched: now,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Event Store Error:', error);
            set({
                isLoading: false,
                error: error.message || 'Failed to fetch events',
            });
        }
    },

    fetchEventDetail: async (eventId, forceRefresh = false) => {
        const { currentEvent, events } = get();

        if (!forceRefresh && currentEvent?.eventId === eventId) return;

        if (!currentEvent) {
            set({ isLoading: true, error: null });
        }

        const existingEvent = events.find((e) => e.eventId === eventId);
        if (existingEvent) {
            set({ currentEvent: existingEvent, error: null });
        }

        set({ isLoading: true, error: null });
        try {
            const response = await getEventApi.getEventDetail(eventId);
            const data = response?.data || response;

            set((state) => ({
                currentEvent: data,
                events: state.events.map((e) => (e.eventId === eventId ? data : e)),
                isLoading: false,
                error: null,
            }));
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    clearCurrentEvent: () => set({ currentEvent: null }),
}));
