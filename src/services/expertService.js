import axiosClient from '../api/axiosClient';

export const registerExpert = async (formDataRaw) => {
  const data = new FormData();
  
  data.append('AccountId', localStorage.getItem('userId'));
  data.append('Style', formDataRaw.style);
  data.append('Bio', formDataRaw.bio);
  data.append('EvidenceType', formDataRaw.evidenceType);
  
  if (formDataRaw.evidenceType === 'pdf') {
    data.append('File', formDataRaw.evidence);
  } else {
    data.append('PortfolioUrl', formDataRaw.portfolioUrl);
  }

  const response = await axiosClient.post('/expert/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const expertApi = {
    getPending: () => axiosClient.get('/expert/admin/pending'),
    getAllVerified: () => axiosClient.get('/expert/verified'),
    processApplication: (fileId, status, reason = "") => 
        axiosClient.post(`/expert/admin/process?fileId=${fileId}&status=${status}&reason=${reason}`),
    deleteExpert: (profileId) => axiosClient.delete(`/expert/${profileId}`),
};