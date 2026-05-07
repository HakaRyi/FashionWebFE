import axiosClient from '@/shared/lib/axios';

export const usertApi = {
  getAllUser: () => axiosClient.get('/Account'),
  banUser: (accountId) => axiosClient.put(`/Admin/ban-user/${accountId}`),
  unbanUser: (accountId) => axiosClient.put(`/Admin/unban-user/${accountId}`),
};