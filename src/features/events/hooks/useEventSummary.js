import { useState, useEffect } from 'react';
import { getEventApi } from '../api/getEvent';

export const useEventSummary = (eventId) => {
    const [data, setData] = useState({
        eventInfo: null,
        leaderboardData: [],
        postsData: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [eventRes, leaderboardRes, postsRes] = await Promise.all([
                    getEventApi.getEventDetail(eventId),
                    getEventApi.getLeaderboard(eventId),
                    getEventApi.getEventPosts(eventId),
                ]);

                setData({
                    eventInfo: eventRes.data || eventRes,
                    leaderboardData: leaderboardRes.data || leaderboardRes,
                    postsData: postsRes.data || postsRes,
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        'Unable to connect to the server. Please try again later.',
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) fetchAllData();
    }, [eventId]);

    return { ...data, isLoading, error };
};
