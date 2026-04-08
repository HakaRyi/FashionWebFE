import React from 'react';
import styles from '../styles/PostsTab.module.scss';

const PostsTab = ({ postsData, onOpenModal }) => {
  return (
    <div className={styles['posts-grid']}>
      {postsData.map((post) => (
        <div 
          key={post.postId} 
          className={styles['post-card']} 
          onClick={() => onOpenModal(post.postId)}
        >
          <div className={styles.imageWrapper}>
            <img src={post.imageUrls?.[0]} alt={post.title} />
            <div className={styles.overlayScore}>⭐ {post.score?.toFixed(2)}</div>
          </div>
          <div className={styles['post-content']}>
            <h3>{post.title}</h3>
            <div className={styles.postMeta}>
              <span>@{post.userName}</span>
              <div className={styles.postStats}>
                <span>❤️ {post.likeCount}</span>
                <span>💬 {post.commentCount}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsTab;