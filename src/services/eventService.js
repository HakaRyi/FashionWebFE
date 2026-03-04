import axiosClient from '../api/axiosClient';


const eventService = {
    createEvent: async (eventData) => {
        const formData = new FormData();

        formData.append('title', eventData.title);
        formData.append('description', eventData.description);
        formData.append('startDate', eventData.startDate.toISOString());
        formData.append('endDate', eventData.endDate.toISOString());
        formData.append('expertWeight', eventData.expertWeight || 70);
        formData.append('hashtags', JSON.stringify(eventData.hashtags));
        formData.append('prizes', JSON.stringify(eventData.prizes));
        
        if (eventData.imageFile) {
            formData.append('image', eventData.imageFile);
        }

        const response = await axiosClient.post('/events', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    depositCoins: async (amount) => {
        const response = await axiosClient.post('/wallet/deposit', { amount });
        return response.data;
    },

    getExpertBalance: async () => {
        const response = await axiosClient.get('/wallet/balance');
        return response.data;
    }
};

export default eventService;