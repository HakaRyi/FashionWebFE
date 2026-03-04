import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Sparkles, Plus, MoreHorizontal } from 'lucide-react';
import styles from './Feed.module.scss';

const FashionFeed = () => {
    const [posts, setPosts] = useState([1, 2, 3]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    //LOGIC RELOAD
    const loadData = useCallback(() => {
        console.log('Reloading: Fetching fresh data...');
        setPosts([1, 2, 3]);
        setHasMore(true);
    }, []);

    // FETCH MORE (Infinite Scroll)
    const fetchMorePosts = useCallback(() => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        setTimeout(() => {
            setPosts((prev) => {
                const lastId = prev[prev.length - 1];
                if (lastId > 20) {
                    setHasMore(false);
                    return prev;
                }
                return [...prev, lastId + 1, lastId + 2];
            });
            setIsLoading(false);
        }, 1000);
    }, [isLoading, hasMore]);

    //Infinite Scroll Trigger
    const lastPostRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchMorePosts();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, fetchMorePosts],
    );

    // --- 4. LOGIC VIEW TRACKING & RELOAD EVENT ---
    useEffect(() => {
        window.addEventListener('reloadFeed', loadData);

        const viewObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const postId = entry.target.getAttribute('data-id');
                    if (entry.isIntersecting) {
                        entry.target.startTime = Date.now();
                    } else if (entry.target.startTime) {
                        const duration = (Date.now() - entry.target.startTime) / 1000;
                        if (duration > 0.5) {
                            console.log(`👁️ POST ${postId}: Viewed for ${duration.toFixed(2)}s`);
                        }
                    }
                });
            },
            { threshold: 0.7 },
        );

        const cards = document.querySelectorAll(`.${styles.fashionCard}`);
        cards.forEach((card) => viewObserver.observe(card));

        return () => {
            window.removeEventListener('reloadFeed', loadData);
            viewObserver.disconnect();
        };
    }, [posts, loadData]);

    return (
        <div className={styles.feedPage}>
            <main className={styles.feedContainer}>
                {posts.map((post) => (
                    <motion.article
                        key={post}
                        data-id={post}
                        className={styles.fashionCard}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.userInfo}>
                                <img src={`https://i.pravatar.cc/100?u=${post}`} alt="avatar" />
                                <div className={styles.userMeta}>
                                    <span className={styles.userName}>@elena_digital</span>
                                    <span className={styles.userRole}>Vogue AI Contributor</span>
                                </div>
                            </div>
                            <button className={styles.moreBtn}>
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className={styles.imageContainer}>
                            <img src={`https://picsum.photos/id/${post + 80}/1000/1250`} alt="Fashion" />
                            <div className={styles.aiTag}>
                                <Sparkles size={12} />
                                <span>AI SYNTHESIZED</span>
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.actionRow}>
                                <div className={styles.leftActions}>
                                    <motion.button whileTap={{ scale: 0.9 }}>
                                        <Heart size={24} />
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.9 }}>
                                        <MessageCircle size={24} />
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.9 }}>
                                        <Share2 size={24} />
                                    </motion.button>
                                </div>
                                <button className={styles.saveBtn}>
                                    <Plus size={24} />
                                </button>
                            </div>

                            <div className={styles.captionArea}>
                                <h2 className={styles.postTitle}>CYBER COUTURE SERIES 0{post}</h2>
                                <p className={styles.description}>
                                    Khám phá sự giao thoa giữa chất liệu vải kỹ thuật số và ánh sáng Neon. Một dự án
                                    được thực hiện hoàn toàn bởi công nghệ GenAI mới nhất.
                                </p>
                                <div className={styles.tags}>#DigitalFashion #VogueAI #FutureSkin</div>
                                <time className={styles.timeAgo}>POSTED 4 HOURS AGO</time>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </main>
        </div>
    );
};

export default FashionFeed;
