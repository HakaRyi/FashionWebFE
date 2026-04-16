import React from 'react';
import { useFeed, FashionCard } from '@/features/feed';
import styles from './Feed.module.scss';

const FashionFeed = () => {
    const { posts, isLoading, hasMore, lastPostRef, commentsMap, toggleComments, addComment, toggleLike } = useFeed();

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.feedPage}>
            <main className={styles.feedContainer}>
                {posts.map((post, index) => (
                    <FashionCard
                        key={post.postId}
                        post={post}
                        lastPostRef={index === posts.length - 1 ? lastPostRef : null}
                        commentsMap={commentsMap}
                        toggleComments={toggleComments}
                        addComment={addComment}
                        formatTime={formatTime}
                        toggleLike={toggleLike}
                    />
                ))}

                {isLoading && (
                    <div className={styles.loaderWrapper}>
                        <div className={styles.spinner}></div>
                        <span>Đang tải xu hướng mới...</span>
                    </div>
                )}

                {!hasMore && posts.length > 0 && (
                    <div className={styles.endMessage}>
                        <div className={styles.line}></div>
                        <span>Bạn đã xem hết tin hôm nay</span>
                        <div className={styles.line}></div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FashionFeed;