import axiosClient from "@/shared/lib/axios";

/**
 * Service xử lý các lệnh gọi API liên quan đến phân tích dữ liệu (Analytics)
 */
export const analyticsApi = {
    /**
     * Lấy dữ liệu Dashboard cho chuyên gia
     * @param {string} period - Khoảng thời gian lọc ('30d', '90d')
     * @returns {Promise<Object>} Data từ Backend trả về { stats, topEvents, chartData }
     */
    getExpertDashboard: async (period = '30d') => {
        try {
            // Sử dụng axiosClient đã có Interceptor Refresh Token
            const response = await axiosClient.get('/events/expert-dashboard', {
                params: { period }
            });
            
            // Trả về dữ liệu gốc để Hook xử lý
            return response.data;
        } catch (error) {
            // Ném lỗi ra ngoài để Hook có thể bắt được và hiển thị lên UI
            throw error;
        }
    }
};