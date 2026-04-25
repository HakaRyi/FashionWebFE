import React, { useState } from 'react';
import { formatVND } from '../utils/formatValue';
import styles from '../styles/LeaderboardTab.module.scss';
import { Award, ArrowRight } from 'lucide-react';
import { PATHS } from "@/app/routes/paths";
import { useParams, useNavigate } from 'react-router-dom';

const DISPLAY_LIMIT = 3;

const LeaderboardTab = ({ leaderboardData, onOpenModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  const winners = leaderboardData.filter(user => user.rewardAmount > 0);
  const theRest = leaderboardData.filter(user => !user.rewardAmount || user.rewardAmount <= 0);

  const displayItems = theRest.slice(0, DISPLAY_LIMIT);

  const getRankLabel = (rank) => {
    if (rank === 1) return "Grand Champion";
    if (rank === 2) return "Runner Up";
    return "Third Place";
  };

  const handleShowAll = () => {
    if (id) {
      navigate(PATHS.EVENT_SUMMARY_FULL_ARCHIVE.replace(':id', id));
    }
  };

  return (
    <div className={styles.leaderboardContainer}>
      {/* Winners Circle */}
      <section className={styles.winnersSection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>The Winners Circle</h2>
          <div className={styles.headerLine} />
        </header>

        <div className={styles.winnersGrid}>
          {winners.map((user) => (
            <div
              key={user.accountId}
              className={`${styles.winnerCard} ${styles[`rank${user.rank}`]}`}
            >
              <span className={styles.bgRankNumber}>0{user.rank}</span>

              <div className={styles.imageWrapper}>
                <img
                  src={user.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`}
                  alt={user.userName}
                />
                <div className={styles.imageOverlay} />
              </div>

              <div className={styles.cardInfo}>
                <span className={styles.rankLabel}>{getRankLabel(user.rank)}</span>
                <h3 className={styles.displayName}>{user.userName}</h3>

                <div className={styles.cardFooter}>
                  <div className={styles.scoreBox}>
                    <span className={styles.label}>Final Score</span>
                    <span className={styles.value}>{user.finalScore?.toFixed(3)}</span>
                  </div>
                  <button className={styles.viewBtn} onClick={() => onOpenModal(user.postId)}>
                    View Portfolio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Honorable Mentions */}
      {theRest.length > 0 && (
        <section className={styles.othersSection}>
          <header className={styles.listHeader}>
            <h2 className={styles.listTitle}>Honorable Mentions</h2>
            <div className={styles.hairline} />
          </header>

          <div className={styles.mentionsGrid}>
            {displayItems.map((user) => (
              <div key={user.accountId} className={styles.mentionItem} onClick={() => onOpenModal(user.postId)}>
                <div className={styles.miniRank}>{user.rank}</div>

                <img
                  className={styles.avatar}
                  src={user.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`}
                  alt={user.userName}
                />

                <div className={styles.info}>
                  <h4>{user.userName}</h4>
                  <div className={styles.meta}>
                    <span>{user.finalScore?.toFixed(3)} PTS</span>
                    <i className={styles.dot} />
                    <span className={styles.verified}>Expert Verified</span>
                  </div>
                </div>

                <button className={styles.detailsBtn}>DETAILS</button>
              </div>
            ))}
          </div>

          {theRest.length > DISPLAY_LIMIT && (
            <div className={styles.archiveAction}>
              <button
                onClick={handleShowAll}
                className={styles.showAllBtn}
              >
                Show All Archive
                <ArrowRight className={styles.arrowIcon} size={16} />
              </button>
            </div>
          )}

        </section>
      )}

      {/* Editorial Insight Section */}
      <section className={styles.insightSection}>
        <div className={styles.insightCard}>
          <Award className={styles.bgIcon} />
          <div className={styles.insightContent}>
            <h4 className={styles.insightTitle}>Editorial Insight</h4>
            <p className={styles.insightText}>
              "This season's collective was defined by an unprecedented mastery of form and silhouette.
              The winners stood out for their ability to balance conceptual density with commercial viability."
            </p>
            <div className={styles.insightFooter}>
              <div className={styles.footerInfo}>
                <p className={styles.tag}>Official Recital Transcript</p>
                <p className={styles.subTag}>Verified by WAPO Noir Audit Team</p>
              </div>
              <div className={styles.seal}>
                <div className={styles.innerDot} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardTab;