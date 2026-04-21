import axiosClient from '@/shared/lib/axios';

class FeedApi {
    async getFeed(cursor = null, pageSize = 10) {
        try {
            const response = await axiosClient.get('/post/feed', {
                params: {
                    cursor,
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

    async globalSearch(keyword) {
        try {
            const response = await axiosClient.get('/search/finding', {
                params: { q: keyword },
            });
            return response.data;
        } catch (error) {
            console.error('FeedApi -> globalSearch -> error', error);
            return { users: [], posts: [] };
        }
    }

    async getPostDetail(postId) {
        try {
            const response = await axiosClient.get(`/post/${postId}`);
            return response.data;
        } catch (error) {
            console.error('FeedApi -> getPostDetail -> error', error);
            throw error;
        }
    }

    async createPost(formData) {
        try {
            const hasEventId = formData.has('EventId') && formData.get('EventId') !== 'null';

            const endpoint = hasEventId ? '/post/event-participation' : '/post';

            const response = await axiosClient.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('FeedApi -> createPost -> error', error);
            throw error;
        }
    }
}

export const feedApi = new FeedApi();
