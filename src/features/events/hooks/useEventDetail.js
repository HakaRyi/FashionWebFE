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
            title: 'Bắt đầu sự kiện ngay?',
            text: 'Sự kiện sẽ chuyển sang trạng thái Active và người dùng có thể nộp bài ngay lập tức.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Bắt đầu ngay',
            cancelButtonText: 'Để sau',
        });

        if (result.isConfirmed) {
            setIsStarting(true);
            try {
                await toast.promise(getEventApi.manualStartEvent(id), {
                    pending: '⌛ Đang kích hoạt sự kiện...',
                    success: 'Sự kiện đã bắt đầu! 🚀',
                    error: {
                        render({ data }) {
                            return data?.response?.data?.message || 'Không thể bắt đầu sự kiện';
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
            toast.error('Không thể tải thông tin sự kiện');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchAllData();
    }, [id]);

    const handleCancel = async () => {
        const result = await MySwal.fire({
            title: 'Hủy sự kiện này?',
            text: 'Tiền thưởng và phí dịch vụ sẽ được hoàn lại vào ví của bạn. Hành động này không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Xác nhận hủy',
            cancelButtonText: 'Quay lại',
        });

        if (result.isConfirmed) {
            setIsCancelling(true);
            try {
                await toast.promise(getEventApi.cancelEvent(id), {
                    pending: '⌛ Đang xử lý hủy và hoàn tiền...',
                    success: 'Sự kiện đã được hủy thành công! 💸',
                    error: {
                        render({ data }) {
                            return data?.response?.data?.message || 'Không thể hủy sự kiện';
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
            title: 'Xác nhận chốt sự kiện?',
            text: 'Hệ thống sẽ thực hiện giải ngân tiền thưởng dựa trên bảng xếp hạng hiện tại. Hành động này không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Xác nhận & Giải ngân',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            setIsFinalizing(true);
            try {
                await toast.promise(getEventApi.finalizeEvent(id), {
                    pending: '🚀 Đang xử lý giải ngân và chốt sự kiện...',
                    success: 'Sự kiện đã kết thúc thành công! 🏆',
                    error: {
                        render({ data }) {
                            return data?.response?.data?.message || 'Lỗi khi chốt sự kiện';
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

    return { event, posts, loading, isFinalizing, isStarting, isCancelling, handleFinalize, handleManualStart, handleCancel };
};
