import axiosClient from '@/shared/lib/axios';

export const followApi = {
    follow: (targetId) => axiosClient.post(`/Follow/${targetId}`),
    unfollow: (targetId) => axiosClient.delete(`/Follow/${targetId}`),
    checkFollowStatus: (targetId) => axiosClient.post(`/Follow/check/${targetId}`),
};