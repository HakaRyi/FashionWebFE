import axiosClient from '@/shared/lib/axios';

export const registerExpert = async (payload) => {
  const data = new FormData();

  data.append('Style', payload.style || '');
  data.append('StyleAesthetic', payload.styleAesthetic || '');
  data.append('YearsOfExperience', parseInt(payload.yearsOfExperience) || 0);
  data.append('Bio', payload.bio || '');
  data.append('EvidenceType', payload.evidenceType);

  if (payload.evidenceType === 'pdf') {
    data.append('File', payload.file);
  } else {
    data.append('PortfolioUrl', payload.portfolioUrl || '');
  }

  const res = await axiosClient.post('/expert/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};

export const expertApi = {
  getAllExperts: () => axiosClient.get('/experts'),

  getPending: () => axiosClient.get('/expert/admin/pending'),

  getAllVerified: () => axiosClient.get('/expert/verified'),

  processApplication: (fileId, status, reason = '') =>
    axiosClient.post(`/expert/admin/process`, null, {
      params: { fileId, status, reason },
    }),

  deleteExpert: (profileId) =>
    axiosClient.delete(`/expert/${profileId}`),

  // Lấy danh sách expert đang hoạt động để mời vào Event
  getActiveList: () => axiosClient.get('/expert/active-list'),

  // Xem chi tiết hồ sơ công khai
  getDetails: (profileId) => axiosClient.get(`/expert/details/${profileId}`),
};