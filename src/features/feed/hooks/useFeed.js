import { useState, useEffect, useRef, useCallback } from 'react';
import { feedApi } from '../api/feed';

export const useFeed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const observer = useRef();

    const fetchPosts = useCallback(async (pageNum, isRefresh = false) => {
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
            console.error("Hook useFeed error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    // Initial load
    useEffect(() => {
        fetchPosts(1, true);
    }, []);

    // Hàm tập trung xử lý Refresh/Reload
    const refreshFeed = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
    }, [fetchPosts]);

    // Infinite scroll observer
    const lastPostRef = useCallback((node) => {
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
    }, [isLoading, hasMore, fetchPosts]);

    // ĐĂNG KÝ EVENT TỪ NAVBAR
    useEffect(() => {
        window.addEventListener('reloadFeed', refreshFeed);
        return () => window.removeEventListener('reloadFeed', refreshFeed);
    }, [refreshFeed]);

    return {
        posts,
        isLoading,
        hasMore,
        lastPostRef,
        refreshFeed
    };
};