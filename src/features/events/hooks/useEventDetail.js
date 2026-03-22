import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getEventApi } from "../api/getEvent";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const useEventDetail = (id) => {
    const [event, setEvent] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFinalizing, setIsFinalizing] = useState(false);

    const fetchAllData = async () => {
        try {
            const [detailRes, postsRes] = await Promise.all([
                getEventApi.getEventDetail(id),
                getEventApi.getEventPosts(id)
            ]);
            setEvent(detailRes.data);
            setPosts(postsRes.data);
        } catch (error) {
            toast.error("Không thể tải thông tin sự kiện");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchAllData();
    }, [id]);

    const handleFinalize = async () => {
        const result = await MySwal.fire({
            title: 'Xác nhận chốt sự kiện?',
            text: "Hệ thống sẽ thực hiện giải ngân tiền thưởng dựa trên bảng xếp hạng hiện tại. Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Xác nhận & Giải ngân',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            setIsFinalizing(true);
            try {
                await toast.promise(
                    getEventApi.finalizeEvent(id),
                    {
                        pending: '🚀 Đang xử lý giải ngân và chốt sự kiện...',
                        success: 'Sự kiện đã kết thúc thành công! 🏆',
                        error: {
                            render({ data }) {
                                return data?.response?.data?.message || "Lỗi khi chốt sự kiện";
                            }
                        }
                    }
                );
                await fetchAllData();
            } catch (error) {
                console.error(error);
            } finally {
                setIsFinalizing(false);
            }
        }
    };

    return { event, posts, loading, isFinalizing, handleFinalize };
};