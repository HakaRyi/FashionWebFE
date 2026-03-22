import { useState, useEffect, useCallback } from 'react';
import { invitationApi } from '../api/invitationApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const useInvitations = (activeTab) => {
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchInvites = useCallback(async () => {
        setLoading(true);
        try {
            const res = activeTab === 'pending' 
                ? await invitationApi.getPending() 
                : await invitationApi.getHistory();
            setInvites(res.data);
        } catch (error) {
            toastError("Không thể tải danh sách lời mời");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchInvites();
    }, [fetchInvites]);

    const toastError = (message) => {
        MySwal.fire({ 
            icon: 'error', 
            title: 'Lỗi', 
            text: message, 
            toast: true, 
            position: 'top-end', 
            showConfirmButton: false, 
            timer: 3000 
        });
    };

    return { invites, loading, fetchInvites, toastError, MySwal };
};