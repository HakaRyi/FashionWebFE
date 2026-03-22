import axiosClient from '@/shared/lib/axios';

export const invitationApi = {
    getPending: () => axiosClient.get('/event-expert/my-invitations'),
    getHistory: () => axiosClient.get('/event-expert/my-assigned-events'),
    respondToInvitation: (eventId, accept) => 
        axiosClient.post(`/event-expert/respond/${eventId}?accept=${accept}`),
};