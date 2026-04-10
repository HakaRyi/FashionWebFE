import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Sparkles, Plus, MoreHorizontal } from 'lucide-react';
import { useFeed } from '@/features/feed';
import styles from './Feed.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const FashionFeed = () => {
    const { posts, isLoading, hasMore, lastPostRef } = useFeed();

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className={styles.feedPage}>
            <main className={styles.feedContainer}>
                {posts.map((post, index) => (
                    <motion.article
                        key={`${post.postId}-${index}`}
                        ref={index === posts.length - 1 ? lastPostRef : null}
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
                                    <span className={styles.userName}>@{post.userName}</span>
                                    <span className={styles.userRole}>
                                        {post.isEvent ? `Event: ${post.eventName}` : 'Contributor'}
                                    </span>
                                </div>
                            </div>
                            <button className={styles.moreBtn}><MoreHorizontal size={20} /></button>
                        </div>

                        {/* Image Body */}
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
                                            <img
                                                src={imgUrl}
                                                alt={`${post.title}-${imgIndex}`}
                                                className={styles.feedImage}
                                            />
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
                            {post.isEvent && (
                                <div className={styles.aiTag}>
                                    <Sparkles size={12} />
                                    <span>EVENT POST</span>
                                </div>
                            )}
                        </div>

                        {/* Footer & Stats */}
                        <div className={styles.cardFooter}>
                            <div className={styles.actionRow}>
                                <div className={styles.leftActions}>
                                    <div className={styles.statAction}>
                                        <motion.button whileTap={{ scale: 0.8 }}>
                                            <Heart size={24} fill={post.isLiked ? "#ff3b3b" : "none"} stroke={post.isLiked ? "#ff3b3b" : "currentColor"} />
                                        </motion.button>
                                        <span className={styles.statNumber}>{post.likeCount?.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.statAction}>
                                        <motion.button whileTap={{ scale: 0.8 }}><MessageCircle size={24} /></motion.button>
                                        <span className={styles.statNumber}>{post.commentCount?.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.statAction}>
                                        <motion.button whileTap={{ scale: 0.8 }}><Share2 size={24} /></motion.button>
                                        <span className={styles.statNumber}>{post.shareCount?.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button className={styles.saveBtn}>
                                    <Plus size={24} stroke={post.isSaved ? "#C1FF72" : "currentColor"} />
                                </button>
                            </div>

                            <div className={styles.captionArea}>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                <p className={styles.description}>{post.content}</p>
                                <div className={styles.tags}>
                                    {post.eventName ? `#${post.eventName.replace(/\s+/g, '')}` : '#Fashion'}
                                </div>
                                <time className={styles.timeAgo}>{formatTime(post.createdAt)}</time>
                            </div>
                        </div>
                    </motion.article>
                ))}

                {isLoading && <div className={styles.loader}>Loading...</div>}
                {!hasMore && <div className={styles.endMessage}>Fin.</div>}
            </main>
        </div>
    );
};

export default FashionFeed;