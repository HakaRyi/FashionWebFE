import axiosClient from '@/shared/lib/axios';

export const eventApi = {
    getAllAdmin: () => axiosClient.get('/events/admin/all'),
    approve: (id) => axiosClient.post(`/events/${id}/approve`),
    reject: (id, reason) => axiosClient.post(`/events/${id}/reject`, { reason })
};