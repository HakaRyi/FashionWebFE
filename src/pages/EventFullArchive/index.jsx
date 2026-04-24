import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEventSummary } from '@/features/events';
import { formatVND } from '@/features/events/utils/formatValue';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, Award, Search, X } from 'lucide-react';
import style from './FullArchive.module.scss';

const FullArchive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leaderboardData, isLoading } = useEventSummary(id);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Logic tính toán Stats dựa trên dữ liệu thực tế
  const stats = useMemo(() => {
    if (!leaderboardData || leaderboardData.length === 0) return { total: 0, winners: 0, avg: 0 };

    const total = leaderboardData.length;
    const winners = leaderboardData.filter(u => u.rewardAmount > 0).length;
    const avg = leaderboardData.reduce((acc, curr) => acc + curr.finalScore, 0) / total;

    return {
      total: total.toString().padStart(2, '0'),
      winners: winners.toString().padStart(2, '0'),
      avg: avg.toFixed(2)
    };
  }, [leaderboardData]);

  // 2. Logic Lọc và Sắp xếp dữ liệu
  const filteredAndSortedData = useMemo(() => {
    if (!leaderboardData) return [];

    return [...leaderboardData]
      .filter(user =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.rank - b.rank);
  }, [leaderboardData, searchQuery]);

  if (isLoading) return (
    <div className={style['archive-loader']}>
      <div className={style.spinner} />
    </div>
  );

  return (
    <div className={style['archive-container']}>
      {/* Editorial Navigation */}
      <nav className={style['archive-nav']}>
        <button onClick={() => navigate(-1)} className={style['back-button']}>
          <ArrowLeft className={style.icon} />
          <span>Back to Event</span>
        </button>

        <div className={style['nav-actions']}>
          <div className={style['search-wrapper']}>
            <Search className={style['search-icon']} />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={style['search-input']}
            />
            {searchQuery && (
              <X
                className={style['clear-search']}
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
        </div>
      </nav>

      <main className={style['archive-content']}>
        <header className={style['hero-section']}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={style['main-title']}
          >
            THE FULL ARCHIVE
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={style['hero-subtitle']}
          >
            <div className={style.divider} />
            <p>Complete roster of evaluated participants and their final rankings.</p>
          </motion.div>
        </header>

        {/* Stats Grid - Dữ liệu thực tế */}
        <section className={style['stats-grid']}>
          <div className={style['stat-card']}>
            <span className={style.label}>Total Entries</span>
            <span className={style.value}>{stats.total}</span>
          </div>
          <div className={`${style['stat-card']} ${style.dark}`}>
            <span className={style.label}>Winners Circle</span>
            <span className={style.value}>{stats.winners}</span>
          </div>
          <div className={style['stat-card']}>
            <span className={style.label}>Avg Score</span>
            <span className={style.value}>{stats.avg}</span>
          </div>
          <div className={`${style['stat-card']} ${style.gold}`}>
            <span className={style.label}>Status</span>
            <span className={style.valueText}>Event Completed</span>
          </div>
        </section>

        {/* Participant List */}
        <section className={style['leaderboard-list']}>
          <AnimatePresence mode='popLayout'>
            {filteredAndSortedData.map((user, index) => (
              <motion.div
                key={user.accountId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.02 }}
                className={`${style['list-item']} ${user.rank <= 3 ? style.elite : ''}`}
              >
                <div className={style['rank-col']}>
                  <span className={style['rank-number']}>
                    {user.rank.toString().padStart(2, '0')}
                  </span>
                  {user.rank === 1 && <Trophy className={style['rank-icon']} />}
                  {user.rank > 1 && user.rank <= 3 && <Award className={style['rank-icon']} />}
                </div>

                <div className={style['user-info-col']}>
                  <div className={style['avatar-wrapper']}>
                    <img
                      src={user.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`}
                      alt={user.userName}
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`;
                      }}
                    />
                  </div>
                  <div className={style.meta}>
                    <h3>{user.userName}</h3>
                    <p className={style.badge}>
                      {user.rank <= 3 ? 'Elite Participant' : 'Certified Contender'}
                    </p>
                  </div>
                </div>

                <div className={style['score-col']}>
                  <span className={style['col-label']}>Final Score</span>
                  <span className={style['score-value']}>{user.finalScore.toFixed(3)}</span>
                </div>

                <div className={style['reward-col']}>
                  {user.rewardAmount > 0 ? (
                    <>
                      <span className={style['reward-label']}>Prize Awarded</span>
                      <span className={style['reward-value']}>{formatVND(user.rewardAmount)}</span>
                    </>
                  ) : (
                    <>
                      <span className={style['reward-label-dim']}>Participation</span>
                      <span className={style['status-text']}>Certificate Verified</span>
                    </>
                  )}
                </div>

                <div className={style['action-col']}>
                  <button className={style['view-details']}>
                    <ArrowLeft className={`${style.icon} ${style.rotate}`} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredAndSortedData.length === 0 && (
            <div className={style['no-results']}>
              No participants found matching "{searchQuery}"
            </div>
          )}
        </section>

        <footer className={style['archive-footer']}>
          <div className={style['footer-status']}>
            <div className={style['ping-dot']} />
          </div>
          <p className={style['footer-legal-title']}>Official Archive of the Noir Couture 2026 Season</p>
          <p className={style['footer-disclaimer']}>
            Records are maintained by the International Design Audit Bureau. Unauthorized duplication or alteration of these rankings is strictly prohibited by editorial decree.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default FullArchive;