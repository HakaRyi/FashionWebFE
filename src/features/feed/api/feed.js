import axiosClient from '@/shared/lib/axios';

class FeedApi {
    async getFeed(pageNumber = 1, pageSize = 10) {
        try {
            const response = await axiosClient.get('/post/feed', {
                params: {
                    pageNumber,
                    pageSize,
                },
            });
            return response.data;
        } catch (error) {
            console.error('FeedApi -> getFeed -> error', error);
            throw error;
        }
    }

    async getComments(postId) {
        try {
            const response = await axiosClient.get(`/post/${postId}/comment`);
            // Giả sử response trả về mảng comments hoặc { items: [] }
            return response.data.items || response.data;
        } catch (error) {
            console.error('FeedApi -> getComments -> error', error);
            return [];
        }
    }

    async createComment(postId, content) {
        try {
            const response = await axiosClient.post(`/post/${postId}/comment`, { content });
            return response.data; // Trả về thông tin comment vừa tạo
        } catch (error) {
            console.error('FeedApi -> createComment -> error', error);
            throw error;
        }
    }

    async toggleLikePost(postId) {
        try {
            const response = await axiosClient.post(`/post/${postId}/like`);
            return response.data;
        } catch (error) {
            console.error('FeedApi -> toggleLikePost -> error', error);
            throw error;
        }
    }
}

export const feedApi = new FeedApi();
