import axiosClient from '../../../shared/lib/axios';

export const getAdminReports = async ({
  status,
  pageNumber = 1,
  pageSize = 10,
}) => {
  const response = await axiosClient.get('/admin/reports', {
    params: {
      status: status && status !== 'All' ? status : undefined,
      pageNumber,
      pageSize,
    },
  });

  return response.data;
};

export const getAdminReportDetail = async (userReportId) => {
  const response = await axiosClient.get(`/admin/reports/${userReportId}`);
  return response.data;
};

export const reviewAdminReport = async (userReportId, payload) => {
  const response = await axiosClient.put(
    `/admin/reports/${userReportId}/review`,
    payload,
  );
  return response.data;
};