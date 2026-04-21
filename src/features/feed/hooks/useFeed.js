import { useState, useEffect, useRef, useCallback } from 'react';
import { feedApi } from '../api/feed';
import { useEventStore } from '@/features/events';

export const useFeed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [commentsMap, setCommentsMap] = useState({});

    const { events, isLoading: isEventsLoading, fetchEvents } = useEventStore();

    const observer = useRef();
    const isFetchingRef = useRef(false);

    // 1. Hàm fetch dữ liệu chính
    const fetchPosts = useCallback(async (currentCursor = null, isRefresh = false) => {
        // Chống gọi trùng lặp (Double fetching)
        if (isFetchingRef.current && !isRefresh) return;

        isFetchingRef.current = true;
        setIsLoading(true);

        try {
            const newPosts = await feedApi.getFeed(currentCursor, 10);

            // Nếu không có dữ liệu trả về hoặc mảng rỗng
            if (!newPosts || newPosts.length === 0) {
                setHasMore(false);
                if (isRefresh) setPosts([]);
                return;
            }

            if (isRefresh) {
                setPosts(newPosts);
                setHasMore(newPosts.length === 10);
            } else {
                setPosts((prev) => {
                    const existingIds = new Set(prev.map((p) => p.postId));
                    const uniquePosts = newPosts.filter((p) => !existingIds.has(p.postId));

                    // Nếu số lượng nhận được ít hơn pageSize (10), tức là đã hết dữ liệu
                    if (newPosts.length < 10) setHasMore(false);

                    return [...prev, ...uniquePosts];
                });
            }
        } catch (error) {
            console.error('Hook useFeed -> fetchPosts error:', error);
            // Có thể thêm thông báo Toast ở đây
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    // 2. Logic Infinite Scroll (Observer)
    const lastPostRef = useCallback(
        (node) => {
            if (isLoading || !hasMore) return;

            // Cleanup observer cũ
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !isFetchingRef.current) {
                        // Kỹ thuật lấy state mới nhất mà không cần dependency 'posts'
                        setPosts((currentPosts) => {
                            const lastPost = currentPosts[currentPosts.length - 1];
                            if (lastPost?.createdAt) {
                                fetchPosts(lastPost.createdAt);
                            }
                            return currentPosts;
                        });
                    }
                },
                { threshold: 0.5 }, // Kích hoạt khi thấy 50% phần tử cuối
            );

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, fetchPosts],
    );

    // 3. Like bài viết (Optimistic Update)
    const toggleLike = useCallback(async (postId) => {
        let originalPost = null;

        setPosts((prev) =>
            prev.map((p) => {
                if (p.postId === postId) {
                    originalPost = { ...p };
                    return {
                        ...p,
                        isLiked: !p.isLiked,
                        likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
                    };
                }
                return p;
            }),
        );

        try {
            const result = await feedApi.toggleLikePost(postId);
            // Đồng bộ lại với kết quả chính xác từ server
            setPosts((prev) =>
                prev.map((p) =>
                    p.postId === postId ? { ...p, isLiked: result.isLiked, likeCount: result.likeCount } : p,
                ),
            );
        } catch (error) {
            // Revert nếu lỗi
            if (originalPost) {
                setPosts((prev) => prev.map((p) => (p.postId === postId ? originalPost : p)));
            }
        }
    }, []);

    // 4. Quản lý Comments
    const toggleComments = useCallback((postId) => {
        setCommentsMap((prev) => {
            if (prev[postId]) {
                const newMap = { ...prev };
                delete newMap[postId];
                return newMap;
            }

            // Tải comment lần đầu
            feedApi
                .getComments(postId)
                .then((data) => {
                    setCommentsMap((current) => ({ ...current, [postId]: data || [] }));
                })
                .catch(() => {
                    setCommentsMap((current) => ({ ...current, [postId]: [] }));
                });

            return { ...prev, [postId]: [] }; // Trạng thái loading tạm thời
        });
    }, []);

    const addComment = async (postId, content) => {
        try {
            const newComment = await feedApi.createComment(postId, content);
            setCommentsMap((prev) => ({
                ...prev,
                [postId]: [...(prev[postId] || []), newComment],
            }));
            setPosts((prev) =>
                prev.map((p) => (p.postId === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p)),
            );
            return true;
        } catch (error) {
            return false;
        }
    };

    // 5. Khởi tạo và Refresh
    const refreshAll = useCallback(() => {
        setHasMore(true);
        fetchPosts(null, true); // Reset về đầu
        fetchEvents?.();
    }, [fetchPosts, fetchEvents]);

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    // Lắng nghe sự kiện reload từ các component khác
    useEffect(() => {
        const handleReload = () => refreshAll();
        window.addEventListener('reloadFeed', handleReload);
        return () => window.removeEventListener('reloadFeed', handleReload);
    }, [refreshAll]);

    return {
        posts,
        isLoading,
        hasMore,
        lastPostRef,
        commentsMap,
        toggleComments,
        addComment,
        toggleLike,
        events,
        isEventsLoading,
        refreshAll,
    };
};
