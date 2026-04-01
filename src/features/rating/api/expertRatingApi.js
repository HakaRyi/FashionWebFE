import axiosClient from '@/shared/lib/axios';

const expertRatingApi = {
    getMyReviews: (eventId) => {
        return axiosClient.get(`expert-rating/my-reviews/${eventId}`);
    },

    getEventSummary: (eventId) => {
        return axiosClient.get(`expert-rating/summary/${eventId}`);
    },

    submitRating: (data) => {
        return axiosClient.post('expert-rating/submit-rating', data);
    }
};

export default expertRatingApi;