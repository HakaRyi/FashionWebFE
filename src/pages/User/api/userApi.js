import axiosClient from '@/shared/lib/axios';

export const usertApi = {
  getAllUser: () => axiosClient.get('/Account'),

};