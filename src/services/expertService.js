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
    const response = await axiosClient.post('/expert/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const expertApi = {
    getAllExperts: () => axiosClient.get('/experts'),
    getPending: () => axiosClient.get('/expert/admin/pending'),
    getAllVerified: () => axiosClient.get('/expert/verified'),
    processApplication: (fileId, status, reason = '') =>
        axiosClient.post(`/expert/admin/process`, null, {
            params: {
                fileId: fileId,
                status: status,
                reason: reason,
            },
        }),
    deleteExpert: (profileId) => axiosClient.delete(`/expert/${profileId}`),
};
