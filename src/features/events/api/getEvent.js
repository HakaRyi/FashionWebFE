import axiosClient from '@/shared/lib/axios';

export const getEventApi = {
    // --- CẤU HÌNH & CHUNG ---

    // Lấy cấu hình phí hệ thống (Phần trăm & Phí tối thiểu)
    getCreationMetadata: () => axiosClient.get('/configurations/event-creation-metadata'),

    // Lấy tất cả sự kiện công khai
    getAllPublicEvents: () => axiosClient.get('/events/public/all'),

    // Chi tiết sự kiện
    getEventDetail: (id) => axiosClient.get(`/events/${id}`),

    // Lấy danh sách bài viết trong sự kiện
    getEventPosts: (id) => axiosClient.get(`/events/${id}/posts`),

    // --- CHO NGƯỜI TẠO (ORGANIZER/EXPERT) ---

    // Lấy sự kiện do chính mình tạo
    getMyCreatedEvents: () => axiosClient.get('/events/expert/my-created'),

    // Kích hoạt sự kiện thủ công (Nếu không để AutoStart)
    manualStartEvent: (id) => axiosClient.post(`/events/${id}/manual-start`),

    // Hủy sự kiện (Hoàn tiền)
    cancelEvent: (id) => axiosClient.post(`/events/${id}/cancel`),

    // Chốt giải thưởng và giải ngân sau khi kết thúc
    finalizeEvent: (id) => axiosClient.post(`/events/${id}/finalize`),

    // --- CHO HỘI ĐỒNG CHUYÊN GIA (JUDGES) ---

    // Lấy các sự kiện được mời chấm điểm (Lời mời đang chờ)
    getInvitedEvents: () => axiosClient.get('/events/expert/invitations'),

    // Lấy lịch sử các sự kiện đã/đang tham gia chấm điểm
    getHistory: () => axiosClient.get('/event-expert/my-assigned-events'),

    // Gửi điểm chấm cho một bài viết
    submitRating: (payload) =>
        axiosClient.post('/events/submit-rating', {
            postId: payload.postId,
            score: payload.score,
            reason: payload.reason,
        }),

    // ---Event Summary---

    getLeaderboard: (id) => axiosClient.get(`/events/${id}/leaderboard`),

    getPostRatingDetails: (postId) => axiosClient.get(`/expert-rating/post/${postId}/details`),
};
