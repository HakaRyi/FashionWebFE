//src/feature/Dashboard/api/dashboardApi.js
import axiosClient from '@/shared/lib/axios';

export const expertApi = {
  getDashboardStatic: (params) => axiosClient.get('/Admin/dashboard-information', { params }),
  getAdminNotifications: (params) => axiosClient.get('/Admin/admin-notifications', { params }),
  getNewUserRecently: () => axiosClient.get('/Admin/new-created-recently'),
  getTransactionList:  (params) => axiosClient.get('/Admin/get-transaction-list', {params}),
};