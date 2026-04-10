import React from 'react';
import { formatVND } from '../utils/formatValue';
import styles from '../styles/LeaderboardTab.module.scss';

const LeaderboardTab = ({ leaderboardData, onOpenModal }) => {
  // Tách Top 3 và phần còn lại
  const topThree = leaderboardData.slice(0, 3);
  const theRest = leaderboardData.slice(3);

  const renderRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className={styles.leaderboardContainer}>
      {/* PHẦN 1: VINH DANH TOP 3 */}
      <div className={styles['top-winners-grid']}>
        {topThree.map((user) => (
          <div 
            key={user.accountId} 
            className={`${styles['rank-card']} ${styles[`rank-${user.rank}`]}`}
          >
            <div className={styles['rank-badge']}>{renderRankIcon(user.rank)}</div>
            <div className={styles.userInfo}>
              <h3>@{user.userName}</h3>
              <div className={styles.scoreDisplay}>
                <span className={styles.mainScore}>
                  {user.finalScore?.toFixed(3).replace(/\.?0+$/, '')}
                </span>
                <label>Điểm chung cuộc</label>
              </div>
            </div>
            {user.rewardAmount > 0 && (
              <div className={styles.prizeBox}>
                <div className={styles.prizeLabel}>Giải Thưởng</div>
                <div className={styles.prizeValue}>{formatVND(user.rewardAmount)}</div>
              </div>
            )}
            <button className={styles.viewResultBtn} onClick={() => onOpenModal(user.postId)}>
              Bảng điểm
            </button>
          </div>
        ))}
      </div>

      {/* PHẦN 2: DANH SÁCH CÒN LẠI (Nếu có) */}
      {theRest.length > 0 && (
        <div className={styles.othersList}>
          <h4 className={styles.listTitle}>Thứ hạng khác</h4>
          <div className={styles.tableHeader}>
            <span>Hạng</span>
            <span>Thí sinh</span>
            <span>Điểm</span>
            <span>Hành động</span>
          </div>
          {theRest.map((user) => (
            <div key={user.accountId} className={styles.rankRow}>
              <div className={styles.rankNum}>#{user.rank}</div>
              <div className={styles.name}>@{user.userName}</div>
              <div className={styles.score}>{user.finalScore?.toFixed(3)}</div>
              <button onClick={() => onOpenModal(user.postId)}>Chi tiết</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;