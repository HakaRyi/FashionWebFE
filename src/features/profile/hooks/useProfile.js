import { useState, useEffect } from 'react';
import { profileApi } from '../api/profileApi';

export const useProfile = (accountId, currentUserId) => {
    const [data, setData] = useState({
        profile: null,
        posts: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchFullProfile = async () => {
            try {
                const isMe = String(accountId) === String(currentUserId);

                const [profRes, postRes] = await Promise.all([
                    profileApi.getProfile(accountId),
                    isMe 
                        ? profileApi.getMyPosts(1, 12) 
                        : profileApi.getUserPosts(accountId, 1, 12)
                ]);

                setData({
                    profile: profRes.data,
                    posts: postRes.data.items || [],
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error("Profile Fetch Error", error);
                setData(prev => ({ ...prev, loading: false, error }));
            }
        };

        if (accountId) fetchFullProfile();
    }, [accountId, currentUserId]);

    return data;
};