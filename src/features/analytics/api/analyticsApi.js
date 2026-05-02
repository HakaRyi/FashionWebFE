import axiosClient from '@/shared/lib/axios';

export const analyticsApi = {
    getExpertDashboard: async (period = '30d') => {
        try {
            const response = await axiosClient.get('/events/expert-dashboard', {
                params: { period },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
