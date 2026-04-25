import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Plus, MoreHorizontal, Send } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import styles from '../styles/FashionCard.module.scss';

const FashionCard = ({ post, lastPostRef, commentsMap, toggleComments, addComment, formatTime, toggleLike }) => {
    const [localComment, setLocalComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSend = async () => {
        if (!localComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const success = await addComment(post.postId, localComment);
        if (success) {
            setLocalComment('');
        }
        setIsSubmitting(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <motion.article
            ref={lastPostRef}
            className={styles.fashionCard}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Header */}
            <div className={styles.cardHeader}>
                <div className={styles.userInfo}>
                    <img
                        src={post.avatarUrl || `https://ui-avatars.com/api/?name=${post.userName}&background=random`}
                        alt="avatar"
                    />
                    <div className={styles.userMeta}>
                        <span className={styles.userName}>{post.userName}</span>
                        <span className={styles.userRole}>
                            {post.isEvent ? `Event: ${post.eventName}` : 'Contributor'}
                        </span>
                    </div>
                </div>
                <button className={styles.moreBtn}><MoreHorizontal size={20} /></button>
            </div>

            {/* Media Body */}
            <div className={styles.imageContainer}>
                {post.images?.length > 1 ? (
                    <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        className={styles.imageSwiper}
                        grabCursor={true}
                    >
                        {post.images.map((imgUrl, imgIndex) => (
                            <SwiperSlide key={imgIndex}>
                                <img src={imgUrl} alt={`${post.title}-${imgIndex}`} className={styles.feedImage} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <img
                        src={post.images?.[0] || 'https://clu.1cdn.vn/2022/06/15/media.congluan.vn-files-content-2022-06-14-_baymax-su-quay-lai-cua-big-hero-6-chinh-thuc-an-dinh-ngay-phat-hanh-173803236.jpg'}
                        alt={post.title}
                        className={styles.feedImage}
                    />
                )}
            </div>

            {/* Footer & Interactions */}
            <div className={styles.cardFooter}>
                <div className={styles.actionRow}>
                    <div className={styles.leftActions}>
                        <div className={styles.statAction}>
                            <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleLike(post.postId)}>
                                <Heart
                                    size={24}
                                    fill={post.isLiked ? "#ff3b3b" : "none"}
                                    stroke={post.isLiked ? "#ff3b3b" : "currentColor"}
                                />
                            </motion.button>
                            <span className={styles.statNumber}>{post.likeCount?.toLocaleString()}</span>
                        </div>
                        <div className={styles.statAction}>
                            <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => toggleComments(post.postId)}
                            >
                                <MessageCircle
                                    size={24}
                                    stroke={commentsMap[post.postId] ? "#b95bb9" : "currentColor"}
                                />
                            </motion.button>
                            <span className={styles.statNumber}>{post.commentCount?.toLocaleString()}</span>
                        </div>
                        <div className={styles.statAction}>
                            <motion.button whileTap={{ scale: 0.8 }}><Share2 size={24} /></motion.button>
                            <span className={styles.statNumber}>{post.shareCount?.toLocaleString()}</span>
                        </div>
                    </div>
                    {/* <button className={styles.saveBtn}>
                        <Plus size={24} stroke={post.isSaved ? "#C1FF72" : "currentColor"} />
                    </button> */}
                </div>

                <div className={styles.captionArea}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.description}>{post.content}</p>
                    <time className={styles.timeAgo}>{formatTime(post.createdAt)}</time>
                </div>

                {/* Comment Section */}
                <AnimatePresence>
                    {commentsMap[post.postId] !== undefined && (
                        <motion.div
                            className={styles.commentSection}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.commentList}>
                                {commentsMap[post.postId].length > 0 ? (
                                    commentsMap[post.postId].map((comment, i) => (
                                        <div key={comment.id || i} className={styles.commentItem}>
                                            <span className={styles.commentUser}>{comment.userName}</span>
                                            <span className={styles.commentContent}>{comment.content}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.noComments}>No comments yet. Be the first!</p>
                                )}
                            </div>

                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={localComment}
                                    onChange={(e) => setLocalComment(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isSubmitting}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!localComment.trim() || isSubmitting}
                                    className={isSubmitting ? styles.loadingBtn : ''}
                                >
                                    <Send size={18} />
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