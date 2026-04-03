import axiosClient from '@/shared/lib/axios';

export const createEventApi = async (eventData) => {
    const formData = new FormData();

    formData.append('Title', eventData.title);
    formData.append('Description', eventData.description || '');
    formData.append('StartTime', new Date(eventData.startDate).toISOString());
    formData.append('SubmissionDeadline', new Date(eventData.submissionDeadline).toISOString());
    formData.append('EndTime', new Date(eventData.endDate).toISOString());

    const expertWeight = parseFloat(eventData.expertWeight) / 100;
    const userWeight = 1 - expertWeight;
    formData.append('ExpertWeight', expertWeight.toFixed(2));
    formData.append('UserWeight', userWeight.toFixed(2));
    formData.append('PointPerLike', parseFloat(eventData.pointPerLike || 1));
    formData.append('PointPerShare', parseFloat(eventData.pointPerShare || 3));
    formData.append('IsAutoStart', eventData.isAutoStart);

    // Validation Range(2, 20)
    const minReq = parseInt(eventData.minExpertsRequired) || 2;
    formData.append('MinExpertsRequired', minReq);

    // 2. Xử lý File
    if (eventData.banner) {
        formData.append('ImageFile', eventData.banner);
    }

    // 3. Xử lý Prizes (Đây là phần hay gây lỗi 400 nhất)
    if (eventData.prizes && eventData.prizes.length > 0) {
        eventData.prizes.forEach((p, index) => {
            formData.append(`Prizes[${index}].Ranked`, parseInt(index + 1));
            formData.append(`Prizes[${index}].RewardAmount`, parseFloat(p.amount));
        });
    }

    // 4. Xử lý InvitedExpertIds
    if (eventData.invitedExpertIds && eventData.invitedExpertIds.length > 0) {
        eventData.invitedExpertIds.forEach((id) => {
            formData.append('InvitedExpertIds', id);
        });
    }

    const res = await axiosClient.post('/events/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};
