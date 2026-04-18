import { create } from 'zustand';
import { invitationApi } from '../api/invitationApi';

export const useInvitationStore = create((set) => ({
    pendingCount: 0,
    loading: false,

    fetchPendingCount: async () => {
        set({ loading: true });
        try {
            const res = await invitationApi.getPending();
            const count = Array.isArray(res.data) ? res.data.length : 0;
            set({ pendingCount: count, loading: false });
        } catch (error) {
            console.error("Fetch count error:", error);
            set({ loading: false });
        }
    },

    decrementCount: () => set((state) => ({ 
        pendingCount: Math.max(0, state.pendingCount - 1) 
    })),
}));