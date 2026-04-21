import React from 'react';
import styles from '../styles/PostsTab.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
            {post.imageUrls?.length > 1 ? (
              <Swiper
                modules={[Pagination, Navigation]}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={true}
                className={styles.mySwiper}
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