import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import expertRatingApi from '../api/expertRatingApi';

export const useExpertRating = (eventId) => {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [criteria, setCriteria] = useState([]);

    /**
     * Fetch dữ liệu từ server
     */
    const fetchMyReviews = useCallback(async () => {
        if (!eventId) return;

        setIsLoading(true);
        try {
            const [reviewsRes, criteriaRes] = await Promise.all([
                expertRatingApi.getMyReviews(eventId),
                expertRatingApi.getEventCriteria(eventId),
            ]);

            setSubmissions(reviewsRes.data || []);
            setCriteria(criteriaRes.data || []);
        } catch (error) {
            const msg = error.response?.data?.message || 'Unable to load the list of exam questions';
            toast.error(`Lỗi: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    }, [eventId]);

    const updateLocalScore = useCallback((postId, newTotalScore, reason, criterionRatings) => {
        setSubmissions((prev) =>
            prev.map((item) =>
                item.postId === postId ? { ...item, score: newTotalScore, reason, criterionRatings } : item,
            ),
        );
    }, []);

    return {
        submissions,
        criteria,
        isLoading,
        fetchMyReviews,
        updateLocalScore,
    };
};
