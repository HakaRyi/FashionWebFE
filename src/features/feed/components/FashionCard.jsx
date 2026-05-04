import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import styles from '../styles/FashionCard.module.scss';
import { PATHS } from '@/app/routes/paths';


const CONTENT_LIMIT = 150;

const FashionCard = ({ post, lastPostRef, commentsMap, toggleComments, addComment, formatTime, toggleLike }) => {
    const [localComment, setLocalComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra xem nội dung có cần nút "Xem thêm" không
    const shouldShowMore = post.content?.length > CONTENT_LIMIT;
    const displayedContent = isExpanded ? post.content : post.content?.slice(0, CONTENT_LIMIT);

    const handleSend = async () => {
        if (!localComment.trim() || isSubmitting) return;
        setIsSubmitting(true);
        const success = await addComment(post.postId, localComment);
        if (success) setLocalComment('');
        setIsSubmitting(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleNavigateDetail = () => {
        navigate(PATHS.POST_DETAIL.replace(':id', post.postId));
    };

    return (
        <motion.article
            ref={lastPostRef}
            className={styles.fashionCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {/* Header: Thu gọn khoảng cách */}
            <div className={styles.cardHeader}>
                <div className={styles.userInfo}>
                    <img
                        className={styles.avatar}
                        src={post.avatarUrl || `https://ui-avatars.com/api/?name=${post.userName}&background=random`}
                        alt={post.userName}
                    />
                    <div className={styles.userMeta}>
                        <span className={styles.userName}>{post.userName}</span>
                        <span className={styles.userRole}>
                            {post.isEvent ? `Event: ${post.eventName}` : 'Contributor'} • {formatTime(post.createdAt)}
                        </span>
                    </div>
                </div>
                <button className={styles.iconBtn}><MoreHorizontal size={18} /></button>
            </div>

            {/* Media Body: Khung cố định tỉ lệ vàng */}
            <div
                className={styles.imageContainer}
                onClick={handleNavigateDetail}
                style={{ cursor: 'pointer' }}>
                {post.images?.length > 1 ? (
                    <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        className={styles.imageSwiper}
                        grabCursor
                    >
                        {post.images.map((imgUrl, idx) => (
                            <SwiperSlide key={idx} className={styles.slide}>
                                <img src={imgUrl} alt="fashion" className={styles.feedImage} loading="lazy" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <img
                        src={post.images?.[0] || 'https://via.placeholder.com/600x800'}
                        alt={post.title}
                        className={styles.feedImage}
                    />
                )}
            </div>

            {/* Interactions: Thanh công cụ nhỏ gọn */}
            <div className={styles.cardFooter}>
                <div className={styles.actionRow}>
                    <div className={styles.leftActions}>
                        <div className={styles.statAction}>
                            <motion.button
                                whileTap={{ scale: 1.4 }}
                                onClick={() => toggleLike(post.postId)}
                                className={post.isLiked ? styles.liked : ''}
                            >
                                <Heart size={22} fill={post.isLiked ? "#ff3b3b" : "none"} stroke={post.isLiked ? "#ff3b3b" : "currentColor"} />
                            </motion.button>
                            <span>{post.likeCount?.toLocaleString()}</span>
                        </div>
                        <div className={styles.statAction}>
                            <motion.button whileTap={{ scale: 1.2 }} onClick={() => toggleComments(post.postId)}>
                                <MessageCircle size={22} />
                            </motion.button>
                            <span>{post.commentCount?.toLocaleString()}</span>
                        </div>
                        <div className={styles.statAction}>
                            <motion.button whileTap={{ scale: 1.2 }}><Share2 size={22} /></motion.button>
                        </div>
                    </div>
                </div>

                {/* Caption Area: Logic See More */}
                <div className={styles.captionArea}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <div className={styles.description}>
                        {displayedContent}
                        {shouldShowMore && (
                            <button className={styles.moreBtn} onClick={() => setIsExpanded(!isExpanded)}>
                                {isExpanded ? ' show less' : '... more'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Comment Section: Tối ưu không gian */}
                <AnimatePresence>
                    {commentsMap[post.postId] !== undefined && (
                        <motion.div
                            className={styles.commentSection}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className={styles.commentList}>
                                {commentsMap[post.postId].length > 0 ? (
                                    commentsMap[post.postId].slice(0, 3).map((comment, i) => (
                                        <div key={comment.id || i} className={styles.commentItem}>
                                            <strong>{comment.userName}</strong> {comment.content}
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.noComments}>Be the first to comment...</p>
                                )}
                            </div>

                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={localComment}
                                    onChange={(e) => setLocalComment(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isSubmitting}
                                />
                                <button onClick={handleSend} disabled={!localComment.trim() || isSubmitting}>
                                    <Send size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.article>
    );
};

export default React.memo(FashionCard);