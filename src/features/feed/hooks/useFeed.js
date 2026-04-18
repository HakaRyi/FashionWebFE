import { useState, useEffect, useRef, useCallback } from 'react';
import { feedApi } from '../api/feed';
import { getEventApi } from '@/features/events';

export const useFeed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [commentsMap, setCommentsMap] = useState({});
    const [events, setEvents] = useState([]);
    const [isEventsLoading, setIsEventsLoading] = useState(false);

    const observer = useRef();
    const isFetchingRef = useRef(false);

    const fetchEvents = useCallback(async () => {
        setIsEventsLoading(true);
        try {
            const response = await getEventApi.getAllPublicEvents();
            setEvents(response.data || response || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setIsEventsLoading(false);
        }
    }, []);

    const fetchPosts = useCallback(async (pageNum, isRefresh = false) => {
        if (isFetchingRef.current && !isRefresh) return;

        isFetchingRef.current = true;
        setIsLoading(true);

        try {
            const newPosts = await feedApi.getFeed(pageNum, 10);

            if (isRefresh) {
                setPosts(newPosts);
                setHasMore(newPosts.length === 10);
            } else {
                setPosts((prev) => {
                    const existingIds = new Set(prev.map((p) => p.postId));
                    const uniquePosts = newPosts.filter((p) => !existingIds.has(p.postId));
                    if (newPosts.length < 10) setHasMore(false);
                    return [...prev, ...uniquePosts];
                });
            }
        } catch (error) {
            console.error('Hook useFeed error:', error);
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    const lastPostRef = useCallback(
        (node) => {
            if (isLoading || !hasMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !isFetchingRef.current) {
                        setPage((prev) => {
                            const nextPage = prev + 1;
                            fetchPosts(nextPage);
                            return nextPage;
                        });
                    }
                },
                { threshold: 0.5 },
            );

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, fetchPosts],
    );

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
            setPosts((prev) =>
                prev.map((p) =>
                    p.postId === postId ? { ...p, isLiked: result.isLiked, likeCount: result.likeCount } : p,
                ),
            );
        } catch (error) {
            if (originalPost) {
                setPosts((prev) => prev.map((p) => (p.postId === postId ? originalPost : p)));
            }
        }
    }, []);

    const toggleComments = useCallback((postId) => {
        setCommentsMap((prev) => {
            const newMap = { ...prev };

            if (newMap[postId]) {
                delete newMap[postId];
                return newMap;
            }

            feedApi
                .getComments(postId)
                .then((data) => {
                    setCommentsMap((current) => ({ ...current, [postId]: data || [] }));
                })
                .catch(() => {
                    setCommentsMap((current) => ({ ...current, [postId]: [] }));
                });

            return { ...prev, [postId]: [] };
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

    const refreshAll = useCallback(() => {
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
        fetchEvents();
    }, [fetchPosts, fetchEvents]);

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    useEffect(() => {
        window.addEventListener('reloadFeed', refreshAll);
        return () => window.removeEventListener('reloadFeed', refreshAll);
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
