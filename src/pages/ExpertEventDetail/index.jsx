import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Users, Trophy, ShieldCheck, Info, CheckCircle, Image as ImageIcon } from "lucide-react";
import { getEventApi } from "@/features/events/api/getEvent";
import { toast } from "react-toastify";
import styles from "./EventDetail.module.scss";

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFinalizing, setIsFinalizing] = useState(false);

    useEffect(() => {
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
        fetchAllData();
    }, [id]);

    const handleFinalize = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn chốt sự kiện này?")) return;

        // Sử dụng toast.promise để thông báo trạng thái loading
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

        // Refresh lại dữ liệu sau khi thành công
        const detailRes = await getEventApi.getEventDetail(id);
        setEvent(detailRes.data);
    };

    if (loading) return <div className={styles.container}>Đang tải...</div>;
    if (!event) return <div className={styles.container}>Không tìm thấy sự kiện.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.actionHeader}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} /> Quay lại
                </button>

                {/* Chỉ hiện nút Finalize nếu event đang Active và bạn là chủ sở hữu */}
                {event.status === "Active" && (
                    <button
                        className={styles.finalizeBtn}
                        onClick={handleFinalize}
                        disabled={isFinalizing}
                    >
                        {isFinalizing ? "Đang xử lý..." : "Chốt & Giải ngân giải thưởng"}
                    </button>
                )}
            </div>

            <div className={styles.mainInfo}>
                <div className={styles.contentCard}>
                    <div className={styles.detailRow}>
                        <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()]}`}>
                            {event.status}
                        </span>
                    </div>
                    <h1>{event.title}</h1>
                    <p className={styles.description}>{event.description}</p>

                    <div className={styles.infoBox}>
                        <h3><Trophy size={18} color="#d4af37" /> Cơ cấu giải thưởng</h3>
                        <div className={styles.prizeList}>
                            {event.prizes?.map((prize) => (
                                <div key={prize.prizeEventId} className={styles.prizeItem}>
                                    <div className={styles.rank}>{prize.ranked}</div>
                                    <div className={styles.amount}>{prize.rewardAmount.toLocaleString()} VNĐ</div>
                                    <div className={styles.status}>{prize.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.sideCard}>
                    <div className={styles.infoBox}>
                        <h3><Info size={18} /> Thông tin chung</h3>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Bắt đầu:</span>
                            <span className={styles.value}>{new Date(event.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Kết thúc:</span>
                            <span className={styles.value}>{new Date(event.endTime).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <h3><ShieldCheck size={18} /> Trọng số</h3>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Chuyên gia:</span>
                            <span className={styles.value}>{event.expertWeight * 100}%</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Cộng đồng:</span>
                            <span className={styles.value}>{event.userWeight * 100}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PHẦN MỚI: Danh sách bài dự thi */}
            <div className={styles.postsSection}>
                <h2>Danh sách bài dự thi ({posts.length})</h2>
                {posts.length > 0 ? (
                    <table className={styles.postsTable}>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tiêu đề bài viết</th>
                                <th>Tác giả</th>
                                <th>Lượt thích</th>
                                <th>Điểm TB</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.postId}>
                                    <td>
                                        {post.imageUrl ? (
                                            <img src={post.imageUrl} className={styles.postThumb} alt="" />
                                        ) : (
                                            <div className={styles.postThumb} style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={16} /></div>
                                        )}
                                    </td>
                                    <td><strong>{post.title}</strong></td>
                                    <td>{post.authorName || "User #" + post.accountId}</td>
                                    <td>{post.likeCount || 0}</td>
                                    <td>
                                        <span className={styles.scoreBadge}>
                                            {post.averageScore?.toFixed(1) || "Chưa chấm"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>Chưa có bài dự thi nào tham gia sự kiện này.</p>
                )}
            </div>
        </div>
    );
};

export default EventDetailPage;