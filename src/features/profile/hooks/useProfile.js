import { useState, useEffect } from 'react';
import { profileApi } from '../api/profileApi';

export const useProfile = (accountId) => {
    const [data, setData] = useState({
        account: null,
        expert: null,
        loading: true
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const accRes = await profileApi.getAccount(accountId);
                
                let expertRes = null;
                try {
                    expertRes = await profileApi.getExpertDetail(accountId);
                } catch (e) { /* Trống */ }

                setData({
                    account: accRes.data,
                    expert: expertRes?.data || null,
                    loading: false
                });
            } catch (error) {
                console.error("Profile Fetch Error", error);
                setData(prev => ({ ...prev, loading: false }));
            }
        };
        fetchProfile();
    }, [accountId]);

    return data;
};