import axiosClient from '@/shared/lib/axios';

export const profileApi = {
    // Lấy thông tin account chung
    getAccount: (id) => axiosClient.get(`/accounts/${id}`),
    // Lấy thông tin expert nếu có
    getExpertDetail: (accountId) => axiosClient.get(`/expert/profile/${accountId}`),
};