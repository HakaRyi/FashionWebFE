/**
 * Cấu hình hiển thị trạng thái sự kiện dựa trên dữ liệu từ Backend
 * Giúp người dùng dễ hiểu quy trình vận hành của Event.
 */
export const EVENT_STATUS_CONFIG = {
    Pending_Review: {
        label: 'Awaiting censorship',
        variant: 'warning',
        description: 'The administrator is reviewing your event content.',
    },
    Rejected: {
        label: 'Rejected',
        variant: 'error',
        description: 'The event has been rejected. The deposit has been refunded to your wallet.',
    },
    Inviting: {
        label: 'Inviting Experts',
        variant: 'info',
        description: 'The system is waiting for experts to confirm their participation in the judging panel.',
    },
    Active: {
        label: 'Active',
        variant: 'success',
        description: 'The event is publicly available. Users can start submitting their entries.',
    },
    Judging: {
        label: 'Judging in progress',
        variant: 'secondary',
        description: 'The judging process is currently in progress.',
    },
    Completed: {
        label: 'Completed',
        variant: 'default',
        description: 'The event has completed the judging process and awards have been distributed.',
    },
    Cancelled_NotEnoughExperts: {
        label: 'Cancelled (Not Enough Experts)',
        variant: 'error',
        description:
            'The event was automatically cancelled due to insufficient expert confirmations. The deposit has been refunded to your wallet.',
    },
    Cancelled_By_Creator: {
        label: 'Cancelled (By Event Creator)',
        variant: 'error',
        description: 'The event has been cancelled by the event creator. The deposit has been refunded to your wallet.',
    },
};

/**
 * Hàm Helper để lấy thông tin hiển thị của một status bất kỳ
 * @param {string} status - Key status từ Backend
 * @returns {Object} Đối tượng chứa label, variant và description
 */
export const getEventStatusInfo = (status) => {
    // Nếu status từ BE trả về không nằm trong danh sách, hiển thị mặc định để tránh crash
    return (
        EVENT_STATUS_CONFIG[status] || {
            label: status || 'Undetermined',
            variant: 'default',
            description: 'Current status is being updated...',
        }
    );
};
