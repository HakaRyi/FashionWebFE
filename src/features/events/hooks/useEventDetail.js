import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getEventApi } from '../api/getEvent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const useEventDetail = (id) => {
    const [event, setEvent] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleManualStart = async () => {
        const result = await MySwal.fire({
            title: 'Start the event now?',
            text: 'The event will become Active and users can submit their work immediately.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Start Now',
            cancelButtonText: 'Later',
        });

        if (result.isConfirmed) {
            setIsStarting(true);
            try {
                await toast.promise(getEventApi.manualStartEvent(id), {
                    pending: '⌛ Starting the event...',
                    success: 'The event has begun!',
                    error: {
                        render({ data }) {
                            return data?.response?.data?.message || 'Cannot start the event';
                        },
                    },
                });
                await fetchAllData();
            } finally {
                setIsStarting(false);
            }
        }
    };

    const fetchAllData = async () => {
        try {
            const [detailRes, postsRes] = await Promise.all([
                getEventApi.getEventDetail(id),
                getEventApi.getEventPosts(id),
            ]);
            setEvent(detailRes.data);
            setPosts(postsRes.data);
        } catch (error) {
            toast.error('Unable to load event information. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchAllData();
    }, [id]);

    const handleCancel = async () => {
        const result = await MySwal.fire({
            title: 'Cancel this event?',
            text: 'Prizes and service fees will be refunded to your wallet. This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Confirm Cancel',
            cancelButtonText: 'Go Back',
        });

        if (result.isConfirmed) {
            setIsCancelling(true);
            try {
                await toast.promise(getEventApi.cancelEvent(id), {
                    pending: '⌛ Processing cancellation and refund...',
                    success: 'The event has been cancelled successfully!',
                    error: {
                        render({ data }) {
                            return data?.response?.data?.message || 'Unable to cancel the event';
                        },
                    },
                });
                await fetchAllData();
            } catch (error) {
                console.error('Cancel error:', error);
            } finally {
                setIsCancelling(false);
            }
        }
    };

    const handleFinalize = async () => {
        const result = await MySwal.fire({
            title: 'Confirm event finalization?',
            text: 'The system will process prize distribution based on the current leaderboard. This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Confirm & Distribute Prizes',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            setIsFinalizing(true);
            try {
                await toast.promise(getEventApi.finalizeEvent(id), {
                    pending: 'Processing prize distribution and finalizing the event...',
                    success: 'The event has been finalized successfully! Prizes are on their way to the winners.',
                    error: {
                        render({ data }) {
                            return data?.response?.data?.message || 'Error finalizing the event';
                        },
                    },
                });
                await fetchAllData();
            } catch (error) {
                console.error(error);
            } finally {
                setIsFinalizing(false);
            }
        }
    };

    return {
        event,
        posts,
        loading,
        isFinalizing,
        isStarting,
        isCancelling,
        handleFinalize,
        handleManualStart,
        handleCancel,
    };
};
