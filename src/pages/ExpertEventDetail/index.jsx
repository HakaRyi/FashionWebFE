import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft, Calendar, ShieldCheck,
    Info, User, Star, Landmark
} from "lucide-react";
import { useEventDetail, PrizeSection, renderExpertStatus, PostTable } from "@/features/events";
import styles from "@/features/events/styles/EventDetail.module.scss";

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { event, posts, loading, isFinalizing, handleFinalize } = useEventDetail(id);

    if (loading) return <div className={styles.loadingContainer}>Đang tải thông tin sự kiện...</div>;
    if (!event) return <div className={styles.container}>Không tìm thấy sự kiện.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.actionHeader}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} /> Quay lại
                </button>

                {event.status === "Active" && (
                    <button
                        className={styles.finalizeBtn}
                        onClick={handleFinalize}
                        disabled={isFinalizing}
                    >
                        <Landmark size={18} /> {isFinalizing ? "Đang xử lý..." : "Chốt & Giải ngân giải thưởng"}
                    </button>
                )}
            </div>

            <div className={styles.eventHero}>
                <div className={styles.imageWrapper}>
                    <img
                        src={event.imageUrl || 'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Hiro.Big-Hero-6.webp'}
                        alt={event.title}
                        className={styles.eventBanner}
                    />
                    <div className={styles.imageOverlay}>
                        <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()]}`}>
                            {event.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.mainLayout}>
                <div className={styles.contentSection}>
                    <div className={styles.eventHeader}>
                        <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()]}`}>
                            {event.status}
                        </span>
                        <h1>{event.title}</h1>
                        <div className={styles.creatorInfo}>
                            <User size={16} /> Được tạo bởi: <strong>{event.creatorName}</strong> (ID: {event.creatorId})
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3><Info size={18} /> Mô tả sự kiện</h3>
                        <p className={styles.description}>{event.description}</p>
                    </div>

                    <PrizeSection prizes={event.prizes} />

                    <PostTable posts={posts} />
                </div>

                <div className={styles.sideSection}>
                    <div className={styles.card}>
                        <h3><Calendar size={18} /> Thời gian</h3>
                        <div className={styles.sideRow}>
                            <span>Bắt đầu:</span>
                            <strong>{new Date(event.startTime).toLocaleString('vi-VN')}</strong>
                        </div>
                        <div className={styles.sideRow}>
                            <span>Kết thúc:</span>
                            <strong>{new Date(event.endTime).toLocaleString('vi-VN')}</strong>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3><ShieldCheck size={18} /> Trọng số chấm điểm</h3>
                        <div className={styles.weightItem}>
                            <div className={styles.weightLabel}>
                                <span>Chuyên gia</span>
                                <span>{event.expertWeight * 100}%</span>
                            </div>
                            <div className={styles.weightBar}>
                                <div style={{ width: `${event.expertWeight * 100}%`, background: '#3b82f6' }}></div>
                            </div>
                        </div>
                        <div className={styles.weightItem}>
                            <div className={styles.weightLabel}>
                                <span>Cộng đồng</span>
                                <span>{event.userWeight * 100}%</span>
                            </div>
                            <div className={styles.weightBar}>
                                <div style={{ width: `${event.userWeight * 100}%`, background: '#10b981' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3><Star size={18} color="#f59e0b" /> Hội đồng chuyên gia</h3>
                        <div className={styles.expertList}>
                            {event.experts?.map((ex) => (
                                <div key={ex.expertId} className={styles.expertItem}>
                                    <div className={styles.expertAvatar}>{ex.fullName?.charAt(0)}</div>
                                    <div className={styles.expertInfo}>
                                        <div className={styles.expertNameRow}>
                                            <p className={styles.expertName}>{ex.fullName}</p>
                                            {renderExpertStatus(ex.status)}
                                        </div>
                                        <p className={styles.expertField}>{ex.expertiseField || "Chuyên gia đánh giá"}</p>
                                    </div>
                                </div>
                            ))}
                            {(!event.experts || event.experts.length === 0) && (
                                <p className={styles.emptyText}>Chưa có chuyên gia nào.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//     ChevronLeft, Calendar, Users, Trophy, ShieldCheck,
//     Info, CheckCircle, Image as ImageIcon, User, Star, Landmark, XCircle, Clock
// } from "lucide-react";
// import { getEventApi } from "@/features/events/api/getEvent";
// import { toast } from "react-toastify";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import styles from "./EventDetail.module.scss";

// const MySwal = withReactContent(Swal);

// const EventDetailPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [event, setEvent] = useState(null);
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isFinalizing, setIsFinalizing] = useState(false);

//     const fetchAllData = async () => {
//         try {
//             const [detailRes, postsRes] = await Promise.all([
//                 getEventApi.getEventDetail(id),
//                 getEventApi.getEventPosts(id)
//             ]);
//             setEvent(detailRes.data);
//             setPosts(postsRes.data);
//         } catch (error) {
//             toast.error("Không thể tải thông tin sự kiện");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAllData();
//     }, [id]);

//     // Hàm bổ trợ hiển thị Badge trạng thái Expert
//     const renderExpertStatus = (status) => {
//         switch (status) {
//             case "Accepted":
//                 return (
//                     <span className={`${styles.expertStatus} ${styles.accepted}`}>
//                         <CheckCircle size={12} /> Đã chấp nhận
//                     </span>
//                 );
//             case "Pending":
//                 return (
//                     <span className={`${styles.expertStatus} ${styles.pending}`}>
//                         <Clock size={12} /> Đang chờ phản hồi
//                     </span>
//                 );
//             case "Rejected":
//                 return (
//                     <span className={`${styles.expertStatus} ${styles.rejected}`}>
//                         <XCircle size={12} /> Đã từ chối
//                     </span>
//                 );
//             default:
//                 return <span className={styles.expertStatus}>{status}</span>;
//         }
//     };

//     const handleFinalize = async () => {
//         const result = await MySwal.fire({
//             title: 'Xác nhận chốt sự kiện?',
//             text: "Hệ thống sẽ thực hiện giải ngân tiền thưởng dựa trên bảng xếp hạng hiện tại. Hành động này không thể hoàn tác!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#10b981',
//             cancelButtonColor: '#64748b',
//             confirmButtonText: 'Xác nhận & Giải ngân',
//             cancelButtonText: 'Hủy'
//         });

//         if (result.isConfirmed) {
//             setIsFinalizing(true);
//             try {
//                 await toast.promise(
//                     getEventApi.finalizeEvent(id),
//                     {
//                         pending: '🚀 Đang xử lý giải ngân và chốt sự kiện...',
//                         success: 'Sự kiện đã kết thúc thành công! 🏆',
//                         error: {
//                             render({ data }) {
//                                 return data?.response?.data?.message || "Lỗi khi chốt sự kiện";
//                             }
//                         }
//                     }
//                 );
//                 await fetchAllData();
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setIsFinalizing(false);
//             }
//         }
//     };

//     if (loading) return <div className={styles.loadingContainer}>Đang tải thông tin sự kiện...</div>;
//     if (!event) return <div className={styles.container}>Không tìm thấy sự kiện.</div>;

//     return (
//         <div className={styles.container}>
//             {/* Header Actions */}
//             <div className={styles.actionHeader}>
//                 <button className={styles.backBtn} onClick={() => navigate(-1)}>
//                     <ChevronLeft size={20} /> Quay lại
//                 </button>

//                 {event.status === "Active" && (
//                     <button
//                         className={styles.finalizeBtn}
//                         onClick={handleFinalize}
//                         disabled={isFinalizing}
//                     >
//                         <Landmark size={18} /> {isFinalizing ? "Đang xử lý..." : "Chốt & Giải ngân giải thưởng"}
//                     </button>
//                 )}
//             </div>

//             <div className={styles.eventHero}>
//                 <div className={styles.imageWrapper}>
//                     <img
//                         src={event.imageUrl || 'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Hiro.Big-Hero-6.webp'}
//                         alt={event.title}
//                         className={styles.eventBanner}
//                     />
//                     <div className={styles.imageOverlay}>
//                         <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()]}`}>
//                             {event.status}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             <div className={styles.mainLayout}>
//                 {/* Cột trái: Nội dung chính */}
//                 <div className={styles.contentSection}>
//                     <div className={styles.eventHeader}>
//                         <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()]}`}>
//                             {event.status}
//                         </span>
//                         <h1>{event.title}</h1>
//                         <div className={styles.creatorInfo}>
//                             <User size={16} /> Được tạo bởi: <strong>{event.creatorName}</strong> (ID: {event.creatorId})
//                         </div>
//                     </div>

//                     <div className={styles.card}>
//                         <h3><Info size={18} /> Mô tả sự kiện</h3>
//                         <p className={styles.description}>{event.description}</p>
//                     </div>

//                     <div className={styles.card}>
//                         <h3><Trophy size={18} color="#d4af37" /> Cơ cấu giải thưởng</h3>
//                         <div className={styles.prizeGrid}>
//                             {event.prizes?.map((prize) => (
//                                 <div key={prize.prizeEventId} className={styles.prizeCard}>
//                                     <div className={styles.prizeRank}>Hạng {prize.ranked}</div>
//                                     <div className={styles.prizeAmount}>{prize.rewardAmount.toLocaleString()} VNĐ</div>
//                                     <div className={styles.prizeStatus}>Trạng thái: {prize.status}</div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className={styles.card}>
//                         <h3><ImageIcon size={18} /> Bài dự thi ({posts.length})</h3>
//                         {posts.length > 0 ? (
//                             <div className={styles.tableWrapper}>
//                                 <table className={styles.postsTable}>
//                                     <thead>
//                                         <tr>
//                                             <th>Ảnh</th>
//                                             <th>Tiêu đề</th>
//                                             <th>Tác giả</th>
//                                             <th>Tương tác</th>
//                                             <th>Điểm TB</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {posts.map((post) => (
//                                             <tr key={post.postId}>
//                                                 <td>
//                                                     <img src={post.imageUrl || '/placeholder.png'} className={styles.postThumb} alt="" />
//                                                 </td>
//                                                 <td><strong>{post.title}</strong></td>
//                                                 <td>{post.authorName || "Ẩn danh"}</td>
//                                                 <td>❤️ {post.likeCount || 0}</td>
//                                                 <td>
//                                                     <span className={styles.scoreBadge}>
//                                                         {post.averageScore?.toFixed(1) || "N/A"}
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         ) : (
//                             <p className={styles.emptyText}>Chưa có bài dự thi nào tham gia.</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Cột phải: Thông tin bổ sung */}
//                 <div className={styles.sideSection}>
//                     <div className={styles.card}>
//                         <h3><Calendar size={18} /> Thời gian</h3>
//                         <div className={styles.sideRow}>
//                             <span>Bắt đầu:</span>
//                             <strong>{new Date(event.startTime).toLocaleString('vi-VN')}</strong>
//                         </div>
//                         <div className={styles.sideRow}>
//                             <span>Kết thúc:</span>
//                             <strong>{new Date(event.endTime).toLocaleString('vi-VN')}</strong>
//                         </div>
//                     </div>

//                     <div className={styles.card}>
//                         <h3><ShieldCheck size={18} /> Trọng số chấm điểm</h3>
//                         <div className={styles.weightItem}>
//                             <div className={styles.weightLabel}>
//                                 <span>Chuyên gia</span>
//                                 <span>{event.expertWeight * 100}%</span>
//                             </div>
//                             <div className={styles.weightBar}>
//                                 <div style={{ width: `${event.expertWeight * 100}%`, background: '#3b82f6' }}></div>
//                             </div>
//                         </div>
//                         <div className={styles.weightItem}>
//                             <div className={styles.weightLabel}>
//                                 <span>Cộng đồng</span>
//                                 <span>{event.userWeight * 100}%</span>
//                             </div>
//                             <div className={styles.weightBar}>
//                                 <div style={{ width: `${event.userWeight * 100}%`, background: '#10b981' }}></div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className={styles.card}>
//                         <h3><Star size={18} color="#f59e0b" /> Hội đồng chuyên gia</h3>
//                         <div className={styles.expertList}>
//                             {event.experts?.map((ex) => (
//                                 <div key={ex.expertId} className={styles.expertItem}>
//                                     <div className={styles.expertAvatar}>{ex.fullName?.charAt(0)}</div>
//                                     <div className={styles.expertInfo}>
//                                         <div className={styles.expertNameRow}>
//                                             <p className={styles.expertName}>{ex.fullName}</p>
//                                             {renderExpertStatus(ex.status)}
//                                         </div>
//                                         <p className={styles.expertField}>{ex.expertiseField || "Chuyên gia đánh giá"}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                             {(!event.experts || event.experts.length === 0) && (
//                                 <p className={styles.emptyText}>Chưa có chuyên gia nào.</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EventDetailPage;