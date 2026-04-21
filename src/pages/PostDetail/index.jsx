import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { feedApi } from '@/features/feed';
import styles from './PostDetailPage.module.scss';

import 'swiper/css';
import 'swiper/css/pagination';

const PostDetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [localComment, setLocalComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch Post Detail
    const fetchPostDetail = useCallback(async () => {
        try {
            const data = await feedApi.getPostDetail(id);
            setPost(data);
        } catch (error) {
            console.error("Error fetching post detail:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchPostDetail();
    }, [fetchPostDetail]);

    // 2. Toggle Like Logic (Optimistic Update)
    const handleToggleLike = async () => {
        if (!post) return;
        const originalPost = { ...post };

        // UI update immediately
        setPost(prev => ({
            ...prev,
            isLiked: !prev.isLiked,
            likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
        }));

        try {
            const result = await feedApi.toggleLikePost(id);
            setPost(prev => ({ ...prev, isLiked: result.isLiked, likeCount: result.likeCount }));
        } catch (error) {
            setPost(originalPost); // Rollback
        }
    };

    // 3. Comment Logic
    const handleToggleComments = async () => {
        if (!showComments && comments.length === 0) {
            try {
                const data = await feedApi.getComments(id);
                setComments(data || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }
        setShowComments(!showComments);
    };

    const handleSendComment = async () => {
        if (!localComment.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const newComment = await feedApi.createComment(id, localComment);
            setComments(prev => [...prev, newComment]);
            setPost(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
            setLocalComment('');
        } catch (error) {
            console.error("Error sending comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getAvatarUrl = (item) => {
        return item?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.userName || 'U')}&background=random&color=fff`;
    };

    if (loading) return <div className={styles.loading}>Loading fashion inspiration...</div>;
    if (!post) return <div className={styles.loading}>Post not found.</div>;

    return (
        <div className={styles.pageContainer}>
            <motion.article 
                className={styles.articleWrapper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <div className={styles.cardHeader}>
                    <div className={styles.userInfo}>
                        <img src={getAvatarUrl(post)} alt={post.userName} className={styles.authorAvatar} />
                        <div className={styles.userMeta}>
                            <span className={styles.userName}>{post.userName}</span>
                            <span className={styles.userRole}>
                                {post.isExpertPost ? 'Expert Choice' : 'Contributor'}
                            </span>
                        </div>
                    </div>
                    <button className={styles.moreBtn}><MoreHorizontal size={20} /></button>
                </div>

                {/* Media Body */}
                <div className={styles.mainImageWrapper}>
                    {post.images?.length > 1 ? (
                        <Swiper modules={[Pagination]} pagination={{ clickable: true }} className={styles.imageSwiper}>
                            {post.images.map((img, idx) => (
                                <SwiperSlide key={idx}><img src={img} alt={post.title} /></SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <img src={post.images?.[0] || 'https://via.placeholder.com/1200'} alt={post.title} />
                    )}
                </div>

                {/* Interaction Bar */}
                <div className={styles.cardFooter}>
                    <div className={styles.actionRow}>
                        <div className={styles.leftActions}>
                            <div className={styles.statAction}>
                                <motion.button whileTap={{ scale: 0.8 }} onClick={handleToggleLike}>
                                    <Heart size={24} fill={post.isLiked ? "#ff3b3b" : "none"} stroke={post.isLiked ? "#ff3b3b" : "currentColor"} />
                                </motion.button>
                                <span className={styles.statNumber}>{post.likeCount?.toLocaleString()}</span>
                            </div>
                            <div className={styles.statAction}>
                                <motion.button whileTap={{ scale: 0.8 }} onClick={handleToggleComments}>
                                    <MessageCircle size={24} stroke={showComments ? "#b23191" : "currentColor"} />
                                </motion.button>
                                <span className={styles.statNumber}>{post.commentCount?.toLocaleString()}</span>
                            </div>
                            <div className={styles.statAction}>
                                <motion.button whileTap={{ scale: 0.8 }}><Share2 size={24} /></motion.button>
                                <span className={styles.statNumber}>{post.shareCount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.captionArea}>
                        <h1 className={styles.postTitle}>{post.title}</h1>
                        <p className={styles.description}>{post.content}</p>
                        <time className={styles.timeAgo}>{formatTime(post.createdAt)}</time>
                    </div>

                    {/* Comment Section (Reusing Feed Style) */}
                    <AnimatePresence>
                        {showComments && (
                            <motion.div 
                                className={styles.commentSection}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <div className={styles.commentList}>
                                    {comments.length > 0 ? (
                                        comments.map((comment, i) => (
                                            <div key={comment.id || i} className={styles.commentItem}>
                                                <span className={styles.commentUser}>@{comment.userName}</span>
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
                                        placeholder="Add a comment..."
                                        value={localComment}
                                        onChange={(e) => setLocalComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                                        disabled={isSubmitting}
                                    />
                                    <button onClick={handleSendComment} disabled={!localComment.trim() || isSubmitting}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.article>
        </div>
    );
};

export default PostDetailPage;