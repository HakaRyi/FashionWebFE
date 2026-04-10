import React from 'react';
import { X, Heart, MessageCircle, Share2, Award, Calendar } from 'lucide-react';
import styles from '../styles/PostDetailModal.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const PostDetailModal = ({ post, onClose }) => {
    if (!post) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>

                <div className={styles.modalBody}>
                    <div className={styles.imageSection}>
                        {post.imageUrls?.length > 1 ? (
                            <Swiper
                                modules={[Pagination, Navigation]}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                navigation={true}
                                className={styles.detailSwiper}
                                grabCursor={true}
                            >
                                {post.imageUrls.map((url, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={url}
                                            alt={`${post.title}-${index}`}
                                            className={styles.feedImage}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <img
                                src={post.imageUrls?.[0] || '/placeholder.png'}
                                alt={post.title}
                                className={styles.feedImage}
                            />
                        )}
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.header}>
                            <div className={styles.author}>
                                <div className={styles.avatar}>{post.userName?.charAt(0)}</div>
                                <div>
                                    <h4>{post.userName}</h4>
                                    <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                            {post.isExpertPost && (
                                <span className={styles.expertBadge}>
                                    <Award size={14} /> Chuyên gia
                                </span>
                            )}
                        </div>

                        <h2 className={styles.postTitle}>{post.title}</h2>
                        <div className={styles.postContent}>{post.content}</div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <Heart size={18} /> <span>{post.likeCount} lượt thích</span>
                            </div>
                            <div className={styles.statItem}>
                                <MessageCircle size={18} /> <span>{post.commentCount} bình luận</span>
                            </div>
                            <div className={styles.statItem}>
                                <Share2 size={18} /> <span>{post.shareCount} chia sẻ</span>
                            </div>
                        </div>

                        <div className={styles.scoreSection}>
                            <div className={styles.scoreLabel}>Điểm đánh giá hiện tại</div>
                            <div className={styles.scoreValue}>{post.score?.toFixed(2) || "0.00"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;