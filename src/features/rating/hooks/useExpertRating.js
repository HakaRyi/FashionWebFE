import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import expertRatingApi from '../api/expertRatingApi';

export const useExpertRating = (eventId) => {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Fetch dữ liệu từ server
     */
    const fetchMyReviews = useCallback(async () => {
        if (!eventId) return;
        
        setIsLoading(true);
        try {
            const response = await expertRatingApi.getMyReviews(eventId);
            setSubmissions(response.data || []);
        } catch (error) {
            const msg = error.response?.data?.message || "Không thể tải danh sách bài thi";
            toast.error(`Lỗi: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    }, [eventId]);

    /**
     * Cập nhật điểm số trực tiếp vào state cục bộ 
     * Giúp UI cập nhật ngay lập tức mà không cần gọi lại API fetch toàn bộ list
     */
    const updateLocalScore = useCallback((postId, score, reason) => {
        setSubmissions(prev => prev.map(item => 
            item.postId === postId 
                ? { ...item, score, reason } 
                : item
        ));
    }, []);

    return {
        submissions,
        isLoading,
        fetchMyReviews,
        updateLocalScore
    };
};