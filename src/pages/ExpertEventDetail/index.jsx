import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft, Calendar, ShieldCheck, Info, User, Star, Landmark, PlayCircle, XCircle
} from "lucide-react";
import {
    useEventDetail, PrizeSection, PostTable, getEventStatusInfo,
    getExpertStatusInfo
} from "@/features/events";
import styles from "@/features/events/styles/EventDetail.module.scss";

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { event, posts, loading, isFinalizing, handleFinalize, isStarting, handleManualStart, isCancelling, handleCancel } = useEventDetail(id);

    if (loading) return <div className={styles.loadingContainer}>Đang tải thông tin sự kiện...</div>;
    if (!event) return <div className={styles.container}>Không tìm thấy sự kiện.</div>;

    const eventStatus = getEventStatusInfo(event.status);

    return (
        <div className={styles.container}>
            <div className={styles.actionHeader}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} /> Quay lại
                </button>

                <div className={styles.rightActions}>
                    {(event.status === "Inviting" || event.status === "Pending_Review") && (
                        <div className={styles.buttonGroup}>

                            {/* NÚT BẮT ĐẦU*/}
                            {event.status === "Inviting" && (
                                <div className={styles.actionItem}>
                                    <button
                                        className={styles.startBtn}
                                        onClick={handleManualStart}
                                        disabled={isStarting || event.isAutoStart || !event.canManualStart}
                                    >
                                        <PlayCircle size={18} />
                                        {isStarting ? "Đang xử lý..." : "Bắt đầu ngay"}
                                    </button>

                                    {event.isAutoStart ? (
                                        <span className={`${styles.hintText} ${styles.autoStart}`}>
                                            <Calendar size={12} /> Tự động bắt đầu
                                        </span>
                                    ) : (
                                        !event.canManualStart && (
                                            <span className={styles.hintText}>
                                                <Info size={12} /> Cần thêm chuyên gia ({event.acceptedExpertsCount}/{event.minExpertsToStart})
                                            </span>
                                        )
                                    )}
                                </div>
                            )}

                            {/* NÚT HỦY: Luôn hiện theo logic cũ của bạn */}
                            <div className={styles.actionItem}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={handleCancel}
                                    disabled={isCancelling}
                                >
                                    <XCircle size={18} />
                                    {isCancelling ? "Đang hủy..." : "Hủy sự kiện"}
                                </button>
                            </div>

                        </div>
                    )}

                    {/* NÚT CHỐT GIẢI (Giữ nguyên logic cũ) */}
                    {event.canFinalize && (
                        <button
                            className={styles.finalizeBtn}
                            onClick={handleFinalize}
                            disabled={isFinalizing}
                        >
                            <Landmark size={18} /> {isFinalizing ? "Đang xử lý..." : "Chốt & Giải ngân"}
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.eventHero}>
                <div className={styles.imageWrapper}>
                    <img
                        src={event.thumbnailUrl || 'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Hiro.Big-Hero-6.webp'}
                        alt={event.title}
                        className={styles.eventBanner}
                    />
                    <div className={styles.imageOverlay}>
                        {/* <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()]}`}>
                            {event.status}
                        </span> */}
                    </div>
                </div>
            </div>

            <div className={styles.mainLayout}>
                <div className={styles.contentSection}>
                    <div className={styles.eventHeader}>
                        <span className={`${styles.statusBadge} ${styles[eventStatus.variant]}`}>
                            {eventStatus.label}
                        </span>
                        <h1>{event.title}</h1>
                        <div className={styles.creatorInfo}>
                            <User size={16} /> Được tạo bởi: <strong>{event.creatorName}</strong>
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
                            <span>Thời hạn nộp bài:</span>
                            <strong>{new Date(event.submissionDeadline).toLocaleString('vi-VN')}</strong>
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
                            {event.experts?.map((ex) => {
                                // LẤY CONFIG CHO TỪNG EXPERT
                                const expertStatus = getExpertStatusInfo(ex.status);

                                return (
                                    <div key={ex.expertId} className={styles.expertItem}>
                                        <div className={styles.expertAvatar}>{ex.fullName?.charAt(0)}</div>
                                        <div className={styles.expertInfo}>
                                            <div className={styles.expertNameRow}>
                                                <p className={styles.expertName}>{ex.fullName}</p>

                                                <span className={`${styles.expertStatus} ${styles[expertStatus.variant]}`}>
                                                    {expertStatus.icon} {expertStatus.label}
                                                </span>
                                            </div>
                                            <p className={styles.expertField}>{ex.expertiseField || "Chuyên gia đánh giá"}</p>
                                        </div>
                                    </div>
                                );
                            })}
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