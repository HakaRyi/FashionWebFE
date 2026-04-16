import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostsTab, RatingModal, LeaderboardTab, formatVND, useEventSummary } from '@/features/events';
import styles from './EventSummary.module.scss';

const EventSummary = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { eventInfo, leaderboardData, postsData, isLoading, error } = useEventSummary(id);

  const handleOpenModal = (postId) => {
    const leaderInfo = leaderboardData.find(p => p.postId === postId);

    const contentInfo = postsData.find(p => p.postId === postId);

    setSelectedPost({
      ...contentInfo,
      ...leaderInfo
    });

    setIsModalOpen(true);
  };

  if (isLoading) return <div className={styles.loadingState}>Đang tổng hợp dữ liệu thời trang...</div>;
  if (error) return <div className={styles.errorState}>Lỗi: {error}</div>;

  return (
    <div className={styles['event-summary']}>
      <div className={styles.container}>

        {/* Banner & Header */}
        <header className={styles.header}>
          {/* <div className={styles.badges}>
            <span className={styles.statusBadge}>{eventInfo?.status}</span>
          </div> */}
          <h1>{eventInfo?.title} <span>Summary</span></h1>
          {/* <p className={styles.description}>{eventInfo?.description}</p> */}

          <div className={styles.eventMeta}>
            <div className={styles.metaItem}>
              <label>Tổng giải thưởng</label>
              <strong>{formatVND(eventInfo?.totalPrizePool)}</strong>
            </div>
            <div className={styles.metaItem}>
              <label>Trọng số (Expert/User)</label>
              <strong>
                {Math.round((eventInfo?.expertWeight || 0) * 100)}% / {Math.round((eventInfo?.userWeight || 0) * 100)}%
              </strong>
            </div>
            <div className={styles.metaItem}>
              <label>Thành viên BGK</label>
              <div className={styles.expertAvatars}>
                {eventInfo?.experts?.map(ex => (
                  <span key={ex.expertId} className={styles.expertNameTag}>
                    {ex.fullName}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.tabs}>
            <button
              className={activeTab === 'leaderboard' ? styles.active : ''}
              onClick={() => setActiveTab('leaderboard')}
            >
              Bảng Vàng
            </button>
            {/* <button
              className={activeTab === 'posts' ? styles.active : ''}
              onClick={() => setActiveTab('posts')}
            >
              Bài Dự Thi ({postsData.length})
            </button> */}
          </div>
        </header>

        {/* Tab Content Rendering */}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab
            leaderboardData={leaderboardData}
            onOpenModal={handleOpenModal}
          />
        )}
        {/* 
        {activeTab === 'posts' && (
          <PostsTab
            postsData={postsData}
            onOpenModal={handleOpenModal}
          />
        )} */}
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <RatingModal
          post={selectedPost}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPost(null);
          }}
          eventWeights={{
            expertWeight: eventInfo?.expertWeight || 0.7,
            userWeight: eventInfo?.userWeight || 0.3
          }}
        />
      )}
    </div>
  );
};

export default EventSummary;