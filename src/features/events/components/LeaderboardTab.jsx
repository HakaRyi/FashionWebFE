import React, { useState } from 'react';
import { formatVND } from '../utils/formatValue';
import styles from '../styles/LeaderboardTab.module.scss';

const ITEMS_PER_PAGE = 5;

const LeaderboardTab = ({ leaderboardData, onOpenModal }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const winners = leaderboardData.filter(user => user.rewardAmount > 0);
  const theRest = leaderboardData.filter(user => !user.rewardAmount || user.rewardAmount <= 0);

  const totalPages = Math.ceil(theRest.length / ITEMS_PER_PAGE);
  const currentItems = theRest.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className={styles.leaderboardContainer}>
      <div className={styles.ambientGlow}></div>
      
      <section className={styles.winnersSection}>
        <header className={styles.sectionHeader}>
          <span className={styles.preTitle}>Hall of Fame</span>
          <h2 className={styles.sectionTitle}>The Winners Circle</h2>
          <div className={styles.titleUnderline}></div>
        </header>

        <div className={styles.winnersGrid}>
          {winners.map((user) => (
            <div 
              key={user.accountId} 
              className={`${styles.winnerCard} ${styles[`rank${user.rank}`]}`}
            >
              <div className={styles.rankNumber}>0{user.rank}</div>
              
              <div className={styles.cardContent}>
                <div className={styles.userMeta}>
                  {/* <span className={styles.userHandle}>@{user.userName.toLowerCase()}</span> */}
                  <h3 className={styles.displayName}>{user.userName}</h3>
                </div>
                
                <div className={styles.statsBox}>
                  <div className={styles.statItem}>
                    <span className={styles.label}>SCORE</span>
                    <span className={styles.value}>{user.finalScore?.toFixed(3)}</span>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.statItem}>
                    <span className={styles.label}>PRIZE</span>
                    <span className={styles.value}>{formatVND(user.rewardAmount)}</span>
                  </div>
                </div>

                <button className={styles.viewBtn} onClick={() => onOpenModal(user.postId)}>
                  VIEW PORTFOLIO
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {theRest.length > 0 && (
        <section className={styles.othersSection}>
          <div className={styles.listHeader}>
            <h4 className={styles.listTitle}>Honorable Mentions</h4>
            <div className={styles.hairline}></div>
          </div>
          
          <div className={styles.elegantTable}>
            {currentItems.map((user) => (
              <div key={user.accountId} className={styles.tableRow}>
                <div className={styles.colRank}>{user.rank.toString().padStart(2, '0')}</div>
                <div className={styles.colUser}>
                  <span className={styles.name}>{user.userName}</span>
                </div>
                <div className={styles.colScore}>
                    <strong>{user.finalScore?.toFixed(3)}</strong>
                    <span>PTS</span>
                </div>
                <div className={styles.colStatus}>Expert Verified</div>
                <div className={styles.colAction}>
                  <button onClick={() => onOpenModal(user.postId)}>Details</button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className={styles.pagination}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>PREVIOUS</button>
              <div className={styles.pageInfo}>
                <span className={styles.current}>{currentPage}</span>
                <span className={styles.sep}>/</span>
                <span className={styles.total}>{totalPages}</span>
              </div>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>NEXT PAGE</button>
            </nav>
          )}
        </section>
      )}
    </div>
  );
};

export default LeaderboardTab;