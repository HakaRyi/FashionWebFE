import axiosClient from '../shared/lib/axios';

const paymentService = {
    topUp: async (amount, provider = 'VNPAY') => {
        const request = {
            amount: amount,
            provider: provider,
            orderCode: `TOPUP_${new Date().getTime()}`
        };
        const response = await axiosClient.post('/wallet/topup', request);
        return response.data;
    }
};

export default paymentService;