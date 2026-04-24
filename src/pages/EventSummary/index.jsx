import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Rocket } from 'lucide-react';
import { RatingModal, LeaderboardTab, formatVND, useEventSummary } from '@/features/events';
import { useAuth } from '@/app/providers/AuthProvider';
import { PATHS } from "@/app/routes/paths";
import classNames from 'classnames/bind';
import styles from './EventSummary.module.scss';

const cx = classNames.bind(styles);

const EventSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user: currentUser } = useAuth();

  const { eventInfo, leaderboardData, postsData, isLoading, error } = useEventSummary(id);

  const handleOpenModal = (postId) => {
    const leaderInfo = leaderboardData.find(p => p.postId === postId);
    const contentInfo = postsData.find(p => p.postId === postId);

    const isExpert = currentUser?.role === 'expert';
    const currentId = currentUser?.accountId || currentUser?.id;
    const postOwnerId = leaderInfo?.accountId || contentInfo?.accountId || contentInfo?.userId;
    const isOwner = currentId && postOwnerId && String(currentId) === String(postOwnerId);

    setSelectedPost({
      ...contentInfo,
      ...leaderInfo,
      canSeeDetails: isExpert || isOwner,
    });

    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loaderContainer}>
          <div className={styles.circleOuter} />
          <div className={styles.circleInner} />
          <Rocket className={styles.rocketIcon} />
        </div>
        <p className={styles.loaderText}>Rendering Exhibition Recap...</p>
      </div>
    );
  }

  const hasNoData = !leaderboardData || leaderboardData.length === 0;

  if (error || hasNoData) {
    return (
      <div className={styles.emptyStateOverlay}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.emptyCard}
        >
          <div className={styles.infoIconWrapper}>
            <Info className={styles.infoIcon} />
          </div>
          <h2 className={styles.emptyTitle}>EMPTY ARCHIVE</h2>
          <p className={styles.emptyDesc}>
            {error?.includes('404') || hasNoData
              ? "The simulation has concluded, but no interaction data was captured for this period. The record remains incomplete."
              : "A technical disruption occurred during data synchronization."}
          </p>
          <button className={styles.returnBtn} onClick={() => navigate(-1)}>
            RETURN TO CATALOG
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.eventSummaryPage}>
      {/* Navigation Header */}
      <nav className={styles.navbar}>
        <button onClick={() => navigate(-1)} className={styles.navBack}>
          <div className={styles.iconCircle}><ArrowLeft size={16} /></div>
          Catalog
        </button>

        <div className={styles.navTitle}>
          <span className={styles.dot} />
          <span className={styles.navLabel}>Event Conclusion Report</span>
        </div>

        <div className={styles.navUser}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{currentUser?.fullName}</p>
            <p className={styles.userRole}>PROJECT {currentUser?.role}</p>
          </div>
          <div className={styles.avatarBox}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.fullName}`}
              alt="Profile"
            />
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        {/* Banner Section */}
        <header className={styles.bannerHeader}>
          <div className={styles.bannerFlex}>
            <div className={styles.titleArea}>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className={styles.subTitle}>
                Event Conclusion Report
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={styles.mainTitle}
              >
                {eventInfo?.title.split(' ')[0]} {eventInfo?.title.split(' ')[1]}
                <span className={styles.highlight}>Summary.</span>
              </motion.h1>
            </div>

            <div className={styles.statsArea}>
              <div className={styles.totalPrize}>
                <span>Total Prize Pool</span>
                <div className={styles.prizeValue}>{formatVND(eventInfo?.totalPrizePool)}</div>
              </div>

              <div className={styles.weightsRow}>
                <div className={styles.weightItem}>
                  <span>Expert Authority</span>
                  <strong>{Math.round((eventInfo?.expertWeight || 0) * 100)}%</strong>
                </div>
                <div className={styles.weightItem}>
                  <span>Public Resonance</span>
                  <strong>{Math.round((eventInfo?.userWeight || 0) * 100)}%</strong>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Judges Bar */}
          <div className={styles.judgesBar}>
            <span className={styles.judgesLabel}>Judging Panel</span>
            <div className={styles.expertList}>
              {eventInfo?.experts?.map(ex => (
                <div key={ex.expertId} className={styles.expertTag}>
                  <div className={styles.expertAvatar}>
                    <img src={ex.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ex.fullName}`} alt="" />
                  </div>
                  <span className={styles.expertName}>{ex.fullName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Controller */}
          <div className={styles.tabController}>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={cx('tabBtn', { active: activeTab === 'leaderboard' })}
            >
              Hall of Merit
              {activeTab === 'leaderboard' && (
                <motion.div layoutId="tab-underline" className={styles.underline} />
              )}
            </button>
            {/* <button className={cx('tabBtn', 'disabled')}>Full Archive</button> */}
          </div>
        </header>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <LeaderboardTab leaderboardData={leaderboardData} onOpenModal={handleOpenModal} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Aesthetic Overlays */}
      <div className={styles.sidebarLeft}>
        <p>SYSTEM ACCESS LEVEL: 04 // WAPO NOIR RECORD 2026</p>
      </div>
      <div className={styles.sidebarRight}>
        <p>EDITORIAL SUPREMACY // RECAP_TRANSCRIPT</p>
      </div>
    </div>
  );
};

export default EventSummary;