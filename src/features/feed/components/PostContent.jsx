import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { feedApi } from '@/features/feed';
import styles from '../styles/PostDetailPage.module.scss';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const PostContent = ({ id, mode = 'page' }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [localComment, setLocalComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef(null);

    const getAvatar = (url, name) => url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const formatRelativeTime = (dateString) => {
        const now = new Date();
        const past = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return 'Just now';

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return past.toLocaleDateString();
    };

    const fetchPostDetail = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await feedApi.getPostDetail(id);
            setPost(data);
            // Tự động load comment ngay từ đầu để trải nghiệm mượt hơn trong layout 2 cột
            const commentData = await feedApi.getComments(id);
            setComments(commentData || []);
        } catch (error) {
            console.error("Error fetching detail:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPostDetail();
    }, [fetchPostDetail]);

    const handleToggleLike = async () => {
        if (!post) return;
        const originalPost = { ...post };
        setPost(prev => ({
            ...prev,
            isLiked: !prev.isLiked,
            likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
        }));
        try {
            const result = await feedApi.toggleLikePost(id);
            setPost(prev => ({ ...prev, isLiked: result.isLiked, likeCount: result.likeCount }));
        } catch (error) {
            setPost(originalPost);
        }
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

    if (loading) return <div className={styles.loadingState}><span>✨ Loading inspiration...</span></div>;
    if (!post) return <div className={styles.loadingState}>Post not found.</div>;

    return (
        <motion.article
            className={`${styles.splitLayout} ${styles[mode]}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* LEFT SIDE: Visuals */}
            <div className={styles.visualColumn}>
                {post.images?.length > 1 ? (
                    <Swiper
                        modules={[Pagination, Navigation]}
                        pagination={{ clickable: true }}
                        navigation
                        className={styles.mainSwiper}
                    >
                        {post.images.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <div className={styles.imageContainer}>
                                    <img src={img} alt={`${post.title} - ${idx}`} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className={styles.imageContainer}>
                        <img src={post.images?.[0] || 'https://via.placeholder.com/1200'} alt={post.title} />
                    </div>
                )}
            </div>

            {/* RIGHT SIDE: Content & Interaction */}
            <div className={styles.contentColumn}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.authorGroup}>
                        {/* Avatar bên trái */}
                        <div className={styles.avatarWrapper}>
                            <img
                                src={getAvatar(post.avatarUrl, post.userName)}
                                className={styles.avatar}
                                alt={post.userName}
                            />
                            {post.isExpertPost && <div className={styles.verifiedBadge}><Check size={10} /></div>}
                        </div>

                        {/* Thông tin Text ở giữa */}
                        <div className={styles.metaInfo}>
                            <div className={styles.nameRow}>
                                <h3 className={styles.userName}>{post.userName}</h3>
                                {post.isExpertPost && <span className={styles.expertLabel}>Expert</span>}
                            </div>

                            <div className={styles.subRow}>
                                <span className={styles.userRole}>
                                    {post.isExpertPost ? 'Expert Choice' : 'Contributor'}
                                </span>
                                <span className={styles.separator}>•</span>
                                <time className={styles.timeStamp}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </time>
                            </div>
                        </div>
                    </div>

                    {/* Nút hành động bên phải */}
                    <button className={styles.iconBtn} aria-label="Tùy chọn">
                        <MoreHorizontal size={20} />
                    </button>
                </header>

                {/* Scrollable Body */}
                <div className={styles.scrollContent}>
                    <section className={styles.mainCaption}>
                        <h1 className={styles.postTitle}>{post.title}</h1>
                        <p className={styles.postDescription}>{post.content}</p>

                    </section>

                    <section className={styles.commentSection}>
                        <h4 className={styles.sectionTitle}>Comments ({comments.length})</h4>
                        {comments.length > 0 ? (
                            <div className={styles.commentList}>
                                {comments.map((comment) => (
                                    <div key={comment.commentId} className={styles.commentItem}>
                                        <div className={styles.cAvatar}>
                                            <img
                                                src={getAvatar(comment.avatarUrl, comment.userName)}
                                                alt={comment.userName}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}&background=random`;
                                                }}
                                            />
                                        </div>

                                        <div className={styles.cContentWrapper}>
                                            <div className={styles.cBubble}>
                                                <span className={styles.cUser}>@{comment.userName}</span>
                                                <p className={styles.cText}>{comment.content}</p>
                                            </div>

                                            {/* Actions nằm dưới Bubble */}
                                            <div className={styles.cActions}>
                                                <span className={styles.cTime}>
                                                    {formatRelativeTime(comment.createdAt)}
                                                </span>
                                                {/* 
                                                <button className={styles.actionBtn}>Like</button>
                                                <button className={styles.actionBtn}>Reply</button> */}

                                                {comment.likeCount > 0 && (
                                                    <span className={styles.cLikes}>
                                                        • {comment.likeCount} likes
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyComments}>Be the first to share your thoughts!</div>
                        )}
                    </section>
                </div>

                {/* Bottom Fixed Interaction */}
                <footer className={styles.footer}>
                    <div className={styles.actionStats}>
                        <div className={styles.leftGroup}>
                            {/* Nút Like */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleToggleLike}
                                className={`${styles.statBtn} ${post.isLiked ? styles.likeActive : ''}`}
                            >
                                <Heart size={24} fill={post.isLiked ? "#ff3b3b" : "none"} stroke={post.isLiked ? "#ff3b3b" : "currentColor"} />
                                <span>{post.likeCount}</span>
                            </motion.button>

                            {/* Nút Comment */}
                            <button className={styles.statBtn} onClick={() => inputRef.current?.focus()}>
                                <MessageCircle size={24} />
                                <span>{post.commentCount}</span>
                            </button>

                            {/* Nút Share */}
                            <button className={styles.statBtn}>
                                <Share2 size={24} />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.commentInputBox}>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Add a comment..."
                            value={localComment}
                            onChange={(e) => setLocalComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                        />
                        <button
                            onClick={handleSendComment}
                            disabled={!localComment.trim() || isSubmitting}
                            className={styles.sendBtn}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </footer>
            </div>
        </motion.article>
    );
};

export default PostContent;