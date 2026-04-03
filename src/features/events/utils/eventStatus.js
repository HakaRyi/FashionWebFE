/**
 * Cấu hình hiển thị trạng thái sự kiện dựa trên dữ liệu từ Backend
 * Giúp người dùng dễ hiểu quy trình vận hành của Event.
 */
export const EVENT_STATUS_CONFIG = {
    Pending_Review: {
        label: "Chờ kiểm duyệt",
        variant: "warning",
        description: "Admin đang kiểm tra nội dung sự kiện của bạn."
    },
    Rejected: {
        label: "Bị từ chối",
        variant: "error",
        description: "Sự kiện không được duyệt. Tiền ký quỹ đã được hoàn trả về ví của bạn."
    },
    Inviting: {
        label: "Đang mời chuyên gia",
        variant: "info",
        description: "Hệ thống đang đợi các chuyên gia xác nhận tham gia hội đồng chấm thi."
    },
    Active: {
        label: "Đang diễn ra",
        variant: "success",
        description: "Sự kiện đang công khai. Người dùng có thể bắt đầu nộp bài dự thi."
    },
    Judging: {
        label: "Đang chấm điểm",
        variant: "secondary",
        description: "Đã hết hạn nộp bài. Ban giám khảo đang tiến hành đánh giá các tác phẩm."
    },
    Completed: {
        label: "Đã kết thúc",
        variant: "default",
        description: "Sự kiện đã hoàn tất quá trình chấm điểm và trao giải thành công."
    },
    Cancelled_NotEnoughExperts: {
        label: "Đã hủy (Thiếu Expert)",
        variant: "error",
        description: "Sự kiện tự động hủy do không đủ số lượng chuyên gia xác nhận. Tiền đã hoàn về ví."
    },
    Cancelled_By_Creator: {
        label: "Đã hủy (Do người tạo sự kiện)",
        variant: "error",
        description: "Sự kiện đã bị hủy bởi người tạo sự kiện. Tiền đã hoàn về ví."
    }
};

/**
 * Hàm Helper để lấy thông tin hiển thị của một status bất kỳ
 * @param {string} status - Key status từ Backend
 * @returns {Object} Đối tượng chứa label, variant và description
 */
export const getEventStatusInfo = (status) => {
    // Nếu status từ BE trả về không nằm trong danh sách, hiển thị mặc định để tránh crash
    return EVENT_STATUS_CONFIG[status] || { 
        label: status || "Không xác định", 
        variant: "default", 
        description: "Trạng thái hiện tại đang được cập nhật..." 
    };
};