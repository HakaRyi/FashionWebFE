import axiosClient from '@/shared/lib/axios';

export const financialApi = {
    getWalletHistory: () => axiosClient.get('/transaction/history/wallet'),

    getMyCreatedEvents: () => axiosClient.get('/events/expert/my-created'),

    getEscrowManagement: () => axiosClient.get('/transaction/expert/escrow-management'),

    approveEscrow: (escrowId) =>
        axiosClient.post(`/transaction/escrow/${escrowId}/approve`),

    getEventCashflow: (eventId) =>
        axiosClient.get(`/transaction/event/${eventId}/cashflow`),

    getTransactionsByReference: (refType, refId) =>
        axiosClient.get(`/transaction/by-reference?refType=${refType}&refId=${refId}`),

    getAllTransactionsAdmin: ({
        type = null,
        refType = null,
        refId = null,
        search = null,
        searchBy = null,
    } = {}) => {
        const params = new URLSearchParams();

        if (type) {
            params.append('type', type);
        }

        if (refType) {
            params.append('refType', refType);
        }

        if (refId) {
            params.append('refId', refId);
        }

        if (search && search.trim()) {
            params.append('search', search.trim());
        }

        if (searchBy && searchBy !== 'all') {
            params.append('searchBy', searchBy);
        }

        const queryString = params.toString();

        return axiosClient.get(
            queryString
                ? `/transaction/admin/all?${queryString}`
                : '/transaction/admin/all',
        );
    },

    getEscrowManagementAdmin: () =>
        axiosClient.get('/transaction/admin/escrow-management'),

    adminRequestFix: (escrowId, reason) =>
        axiosClient.post(
            `/transaction/admin/request-fix?escrowId=${escrowId}&reason=${encodeURIComponent(reason)}`,
        ),

    adminExecuteFix: (escrowId) =>
        axiosClient.post(`/transaction/admin/execute-fix/${escrowId}`),
};