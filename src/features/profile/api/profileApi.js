import axiosClient from '@/shared/lib/axios';

export const profileApi = {
    getProfile: (id) => axiosClient.get(`/profile/${id}`),
    
    getMyPosts: (page = 1, pageSize = 10) => 
        axiosClient.get('/post/me', { params: { page, pageSize } }),

    getUserPosts: (accountId, page = 1, pageSize = 10) => 
        axiosClient.get(`/post/user/${accountId}`, { params: { page, pageSize } }),
};