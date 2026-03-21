import axiosClient from '@/shared/lib/axios';

/**
 * API Service cho quản lý sự kiện
 */
export const getEventApi = {
    // --- CHO EXPERT (Người tạo) ---

    // Lấy sự kiện của tôi (Expert hiện tại tạo)
    getMyCreatedEvents: () => axiosClient.get('/events/my-events'),

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


    // --- CHO USER & CÔNG KHAI ---

    // Lấy tất cả sự kiện công khai (cho trang chủ/khám phá)
    getAllPublicEvents: () => axiosClient.get('/events/public/all'),

    // Xem chi tiết sự kiện
    getEventDetail: (id) => axiosClient.get(`/events/${id}`),

    // Lấy danh sách bài post trong sự kiện (để chấm điểm hoặc xem bảng xếp hạng)
    getEventPosts: (id) => axiosClient.get(`/events/${id}/posts`),
};