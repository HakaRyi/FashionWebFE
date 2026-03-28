import axiosClient from '@/shared/lib/axios';

/**
 * API Service cho quản lý sự kiện
 */
export const getEventApi = {
    // --- CHO EXPERT (Người tạo) ---

    // Lấy sự kiện của tôi (Expert hiện tại tạo)
    getMyCreatedEvents: () => axiosClient.get('/events/expert/my-created'),

    // Chốt giải thưởng và giải ngân
    finalizeEvent: (eventId) => axiosClient.post(`/events/${eventId}/finalize`),


    // --- CHO CHUYÊN GIA CHẤM ĐIỂM (Hội đồng) ---

    // Lấy các sự kiện được mời chấm điểm
    getInvitedEvents: () => axiosClient.get('/events/expert/invitations'),

    // Gửi điểm chấm cho một bài viết
    submitRating: (payload) => axiosClient.post('/events/submit-rating', {
        postId: payload.postId,
        score: payload.score,
        reason: payload.reason
    }),

    getAllPublicEvents: () => axiosClient.get('/events/public/all'),

    getEventDetail: (id) => axiosClient.get(`/events/${id}`),

    getEventPosts: (id) => axiosClient.get(`/events/${id}/posts`),

    finalizeEvent: (id) => axios.post(`/events/${id}/finalize`),
};