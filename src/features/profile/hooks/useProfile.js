import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { profileApi } from '../api/profileApi';
import { followApi } from '../api/followApi';

export const useProfile = (accountId, currentUserId) => {
    const [data, setData] = useState({
        profile: null,
        posts: [],
        isFollowing: false,
        loading: true,
        error: null,
    });

    const fetchFullProfile = useCallback(async () => {
        if (!accountId) return;

        setData((prev) => ({ ...prev, loading: true }));

        try {
            const isMe = String(accountId) === String(currentUserId);

            // Thực hiện gọi API song song để tối ưu tốc độ load trang
            const [profRes, postRes, followRes] = await Promise.all([
                profileApi.getProfile(accountId),
                isMe ? profileApi.getMyPosts(1, 12) : profileApi.getUserPosts(accountId, 1, 12),
                !isMe && currentUserId
                    ? followApi.checkFollowStatus(accountId)
                    : Promise.resolve({ data: { isFollowing: false } }),
            ]);

            setData({
                profile: profRes.data,
                posts: postRes.data?.items || [],
                isFollowing: !!followRes.data?.isFollowing,
                loading: false,
                error: null,
            });
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || 'Profile information could not be loaded. Please try again later.';
            console.error('Profile Fetch Error:', error);
            setData((prev) => ({ ...prev, loading: false, error: errorMsg }));
            toast.error(errorMsg);
        }
    }, [accountId, currentUserId]);

    useEffect(() => {
        fetchFullProfile();
    }, [fetchFullProfile]);

    const toggleFollow = useCallback(async () => {
        // Chặn nếu chưa đăng nhập
        if (!currentUserId) {
            toast.info('Please log in to perform this action');
            return;
        }

        // Chặn nếu dữ liệu profile chưa load xong
        if (!data.profile) return;

        const wasFollowing = data.isFollowing;
        const targetId = accountId;

        const displayName = data.profile.username || 'User';

        // 1. Cập nhật UI ngay lập tức (Optimistic Update)
        setData((prev) => ({
            ...prev,
            isFollowing: !wasFollowing,
            profile: {
                ...prev.profile,
                followerCount: wasFollowing
                    ? Math.max(0, (prev.profile.followerCount || 0) - 1)
                    : (prev.profile.followerCount || 0) + 1,
            },
        }));

        try {
            // 2. Gọi API thực tế
            if (wasFollowing) {
                await followApi.unfollow(targetId);
                toast.success(`Unfollowed ${displayName}`);
            } else {
                await followApi.follow(targetId);
                toast.success(`Following ${displayName}`);
            }
        } catch (err) {
            console.error('Toggle follow failed:', err);

            setData((prev) => ({
                ...prev,
                isFollowing: wasFollowing,
                profile: {
                    ...prev.profile,
                    followerCount: wasFollowing
                        ? (prev.profile.followerCount || 0) + 1
                        : Math.max(0, (prev.profile.followerCount || 0) - 1),
                },
            }));

            const errMsg = err.response?.data?.message || 'Action failed, please try again.';
            toast.error(errMsg);
        }
    }, [accountId, currentUserId, data.isFollowing, data.profile]);

    return {
        ...data,
        toggleFollow,
        refreshProfile: fetchFullProfile,
    };
};
