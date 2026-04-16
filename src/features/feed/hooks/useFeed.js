import { useState, useEffect, useRef, useCallback } from 'react';
import { feedApi } from '../api/feed';

export const useFeed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const [commentsMap, setCommentsMap] = useState({});

    const observer = useRef();

    const fetchPosts = useCallback(
        async (pageNum, isRefresh = false) => {
            if (isLoading && !isRefresh) return;
            setIsLoading(true);
            try {
                const newPosts = await feedApi.getFeed(pageNum, 10);
                if (isRefresh) {
                    setPosts(newPosts);
                    setHasMore(newPosts.length === 10);
                } else {
                    setPosts((prev) => [...prev, ...newPosts]);
                    if (newPosts.length < 10) setHasMore(false);
                }
            } catch (error) {
                console.error('Hook useFeed error:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading],
    );

    // Hàm lấy comment và toggle hiển thị
    const toggleComments = useCallback(
        async (postId) => {
            if (commentsMap[postId]) {
                // Nếu đã có data, ẩn đi bằng cách xóa key
                const newMap = { ...commentsMap };
                delete newMap[postId];
                setCommentsMap(newMap);
            } else {
                // Nếu chưa có, fetch từ API
                const data = await feedApi.getComments(postId);
                if (data && data.length > 0) {
                    setCommentsMap((prev) => ({ ...prev, [postId]: data }));
                } else {
                    // Nếu không có comment, chỉ khởi tạo mảng rỗng để hiện phần input
                    setCommentsMap((prev) => ({ ...prev, [postId]: [] }));
                }
            }
        },
        [commentsMap],
    );

    // Hàm gửi comment mới
    const addComment = async (postId, content) => {
        try {
            const newComment = await feedApi.createComment(postId, content);
            setCommentsMap((prev) => ({
                ...prev,
                [postId]: [...(prev[postId] || []), newComment],
            }));
            return true;
        } catch (error) {
            return false;
        }
    };

    const toggleLike = useCallback(
        async (postId) => {
            const postIndex = posts.findIndex((p) => p.postId === postId);
            if (postIndex === -1) return;

            const oldPost = posts[postIndex];

            const updatedPosts = [...posts];
            updatedPosts[postIndex] = {
                ...oldPost,
                isLiked: !oldPost.isLiked,
                likeCount: oldPost.isLiked ? oldPost.likeCount - 1 : oldPost.likeCount + 1,
            };
            setPosts(updatedPosts);

            try {
                const result = await feedApi.toggleLikePost(postId);

                setPosts((prev) =>
                    prev.map((p) =>
                        p.postId === postId ? { ...p, isLiked: result.isLiked, likeCount: result.likeCount } : p,
                    ),
                );
            } catch (error) {
                setPosts(posts);
                alert('Không thể thực hiện hành động này. Vui lòng thử lại!');
            }
        },
        [posts],
    );

    useEffect(() => {
        fetchPosts(1, true);
    }, []);

    const refreshFeed = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
    }, [fetchPosts]);

    const lastPostRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => {
                        const nextPage = prev + 1;
                        fetchPosts(nextPage);
                        return nextPage;
                    });
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, fetchPosts],
    );

    useEffect(() => {
        window.addEventListener('reloadFeed', refreshFeed);
        return () => window.removeEventListener('reloadFeed', refreshFeed);
    }, [refreshFeed]);

    return {
        posts,
        isLoading,
        hasMore,
        lastPostRef,
        refreshFeed,
        commentsMap,
        toggleComments,
        addComment,
        toggleLike,
    };
};
