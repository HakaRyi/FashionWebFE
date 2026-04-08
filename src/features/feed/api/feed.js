import axiosClient from '@/shared/lib/axios';

class FeedApi {
    async getFeed(pageNumber = 1, pageSize = 10) {
        try {
            const response = await axiosClient.get('/post/feed', {
                params: {
                    pageNumber,
                    pageSize
                }
            });
            return response.data;
        } catch (error) {
            console.error('FeedApi -> getFeed -> error', error);
            throw error;
        }
    }
}

export const feedApi = new FeedApi();