import axiosClient from '@/shared/lib/axios';

export const financialApi = {
    // --- VÍ & LỊCH SỬ GIAO DỊCH ---

    // Lấy lịch sử biến động số dư ví
    getWalletHistory: () => axiosClient.get('/transaction/history/wallet'),

    // --- QUẢN LÝ SỰ KIỆN (DƯỚI GÓC ĐỘ TÀI CHÍNH) ---

    // Lấy danh sách sự kiện do Expert tạo (Để tính số lượng sự kiện quản lý)
    getMyCreatedEvents: () => axiosClient.get('/events/expert/my-created'),

    // --- ĐỐI SOÁT & ESCROW (KÝ QUỸ) ---

    // Lấy danh sách các giao dịch ký quỹ cần đối soát
    getEscrowManagement: () => axiosClient.get('/transaction/expert/escrow-management'),

    // Phê duyệt giải ngân ký quỹ (Approve Escrow)
    approveEscrow: (escrowId) => axiosClient.post(`/transaction/escrow/${escrowId}/approve`),

    // --- CHI TIẾT DÒNG TIỀN THEO SỰ KIỆN ---

    // Lấy chi tiết thu/chi của một sự kiện cụ thể
    getEventCashflow: (eventId) => axiosClient.get(`/transaction/event/${eventId}/cashflow`),

    // Lấy giao dịch theo tham chiếu (Ví dụ: refType=Event & refId=123)
    getTransactionsByReference: (refType, refId) => 
        axiosClient.get(`/transaction/by-reference?refType=${refType}&refId=${refId}`),

    // --- ADMIN TOÀN CỤC ---

    /**
     * Tổng tra cứu cho Admin (Có filter linh hoạt)
     * @param {string} type - Loại giao dịch (Credit/Debit)
     * @param {string} refType - Loại tham chiếu (Event/EventFix...)
     * @param {number} refId - ID tham chiếu
     */

    getAllTransactionsAdmin: (type = null, refType = null, refId = null) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (refType) params.append('refType', refType);
        if (refId) params.append('refId', refId);
        return axiosClient.get(`/transaction/admin/all?${params.toString()}`);
    },

    /**
     * Quản lý Escrow cho Admin
     * Lấy toàn bộ danh sách các phiên giữ tiền để theo dõi trạng thái
     */
    getEscrowManagementAdmin: () => axiosClient.get('/transaction/admin/escrow-management'),

    /**
     * Admin yêu cầu Expert duyệt để xử lý kẹt tiền
     * @param {number} escrowId - ID phiên Escrow
     * @param {string} reason - Lý do cần điều chỉnh tiền
     */
    adminRequestFix: (escrowId, reason) => 
        axiosClient.post(`/transaction/admin/request-fix?escrowId=${escrowId}&reason=${encodeURIComponent(reason)}`),

    /**
     * Admin thực thi cập nhật ví (Bước cuối cùng sau khi Expert duyệt)
     * @param {number} escrowId - ID phiên Escrow
     */
    adminExecuteFix: (escrowId) => 
        axiosClient.post(`/transaction/admin/execute-fix/${escrowId}`),
};
