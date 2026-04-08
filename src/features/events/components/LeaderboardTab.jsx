import React from 'react';
import { formatVND } from '../utils/formatValue';
import styles from '../styles/LeaderboardTab.module.scss';

const LeaderboardTab = ({ leaderboardData, onOpenModal }) => {
  return (
    <div className={styles['leaderboard-grid']}>
      {leaderboardData.map((user) => (
        <div 
          key={user.accountId} 
          className={`${styles['rank-card']} ${styles[`rank-${user.rank}`]}`}
        >
          <div className={styles['rank-badge']}>
            {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
          </div>
          <div className={styles.userInfo}>
            <h3>@{user.userName}</h3>
            <div className={styles.scoreDisplay}>
              <span className={styles.mainScore}>{user.finalScore?.toFixed(3)}</span>
              <label>Điểm chung cuộc</label>
            </div>
          </div>
          {user.rewardAmount && (
            <div className={styles.prizeBox}>
              <div className={styles.prizeLabel}>Giải Thưởng</div>
              <div className={styles.prizeValue}>{formatVND(user.rewardAmount)}</div>
            </div>
          )}
          <button 
            className={styles.viewResultBtn} 
            onClick={() => onOpenModal(user.postId)}
          >
            Xem bảng điểm
          </button>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardTab;