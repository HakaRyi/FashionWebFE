import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  X, Heart, MessageCircle, Award, Star, 
  BarChart3, Calendar, Loader2, Share2, Info 
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import { getEventApi } from '../api/getEvent';
import { formatDate } from '../utils/formatValue';
import styles from '../styles/RatingModal.module.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const RatingModal = ({ post, onClose, eventWeights }) => {
  const [data, setData] = useState(post);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  // --- Logic Fetching ---
  useEffect(() => {
    if (!post?.postId) return;

    const fetchExtraDetails = async () => {
      setIsFetchingDetails(true);
      try {
        const res = await getEventApi.getPostRatingDetails(post.postId);
        const details = res.data || res;
        setData(prev => ({ ...prev, ...details }));
      } catch (err) {
        console.error("Lỗi khi tải chi tiết thẩm định:", err);
      } finally {
        setIsFetchingDetails(false);
      }
    };

    fetchExtraDetails();
  }, [post?.postId]);

  // --- Helpers ---
  const formatScore = useCallback((val, digits = 2) => {
    if (val === null || val === undefined) return "0";
    return Number(val).toFixed(digits).replace(/\.?0+$/, '');
  }, []);

  if (!post) return null;

  // --- Renders ---
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className={styles.container}>
          
          {/* LEFT: VISUAL & CONTENT SECTION */}
          <section className={styles.visualSection}>
            <div className={styles.imageGallery}>
              {data?.imageUrls?.length > 1 ? (
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  navigation={true}
                  className={styles.mainSwiper}
                >
                  {data.imageUrls.map((url, i) => (
                    <SwiperSlide key={`slide-${i}`}>
                      <img src={url} alt={`fashion-view-${i}`} className={styles.slideImg} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src={data?.imageUrls?.[0] || '/placeholder.png'}
                  alt="fashion-post"
                  className={styles.singleImage}
                />
              )}
            </div>

            <div className={styles.postInfoCard}>
              <header className={styles.postHeader}>
                <div className={styles.user}>
                  <div className={styles.avatar}>
                    <img
                      src={data?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data?.userName || 'User')}&background=random&color=fff&size=128`}
                      alt={data?.userName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=User&background=random&color=fff`;
                      }}
                    />
                  </div>
                  <div className={styles.userMeta}>
                    <h4>@{data?.userName || 'unknown'}</h4>
                    <span><Calendar size={12} /> {formatDate(data?.createdAt)}</span>
                  </div>
                </div>
                <div className={styles.quickStats}>
                  <div className={styles.statItem}>
                    <Heart size={16} className={styles.heartIcon} fill="#ff4d4f" />
                    <span>{data?.likeCount || 0}</span>
                  </div>
                  <div className={styles.statItem}>
                    <MessageCircle size={16} />
                    <span>{data?.commentCount || 0}</span>
                  </div>
                </div>
              </header>

              <div className={styles.contentScroll}>
                <h3 className={styles.postTitle}>{data?.title}</h3>
                <p className={styles.postDescription}>
                  {data?.content || "Không có nội dung mô tả cho bài viết này."}
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT: RATING & REPORT SECTION */}
          <section className={styles.reportSection}>
            <header className={styles.reportHeader}>
              <span className={styles.eyebrow}>Thẩm định chi tiết</span>
              <div className={styles.scoreSummaryRow}>
                <div className={styles.finalScoreBadge}>
                  <Star size={20} fill="currentColor" />
                  <span>{formatScore(data?.finalScore || data?.score, 3)}</span>
                </div>
                <div className={styles.scoreLabel}>
                  <strong>Tổng điểm cuối</strong>
                  <p>Hệ số: {Math.round(eventWeights?.expertWeight * 100)}% Chuyên gia / {Math.round(eventWeights?.userWeight * 100)}% Cộng đồng</p>
                </div>
              </div>
              <div className={styles.expertBonusInfo}>
                <Info size={12} />
                <small>Trọng số: 1 Like = <b>{data.pointPerLike}</b>đ | 1 Share = <b>{data.pointPerShare}</b>đ</small>
              </div>
            </header>

            <div className={styles.finalStatsRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>
                  <Heart size={14} fill="#ff4d4f" color="#ff4d4f" /> Tim lúc chốt
                </div>
                <div className={styles.statValue}>{data?.finalLikeCount || 0}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>
                  <Share2 size={14} color="#1890ff" /> Share lúc chốt
                </div>
                <div className={styles.statValue}>{data?.finalShareCount || 0}</div>
              </div>
            </div>

            <div className={styles.weightBreakdown}>
              <div className={styles.weightCard}>
                <label>Cộng đồng</label>
                <div className={styles.val}>{formatScore(data?.communityScore)}</div>
              </div>
              <div className={styles.weightCard}>
                <label>Chuyên gia</label>
                <div className={styles.val}>{formatScore(data?.expertTotalScore)}</div>
              </div>
            </div>

            <div className={styles.expertListContainer}>
              <h3 className={styles.sectionTitle}>
                <BarChart3 size={18} /> Đánh giá từ hội đồng
                {isFetchingDetails && <Loader2 size={16} className={`${styles.spin} ${styles.loader}`} />}
              </h3>

              <div className={styles.scrollArea}>
                {data?.expertReviews?.length > 0 ? (
                  data.expertReviews.map((review, idx) => (
                    <article key={`review-${idx}`} className={styles.reviewCard}>
                      <div className={styles.expertHeader}>
                        <div className={styles.name}>
                          <Award size={14} /> {review.expertName}
                        </div>
                        <span className={styles.totalGiven}>{review.totalScoreGiven}/10</span>
                      </div>

                      <blockquote className={styles.comment}>
                        "{review.reason || 'Chuyên gia không để lại nhận xét cụ thể.'}"
                      </blockquote>

                      <div className={styles.criteriaGrid}>
                        {review.criteriaScores?.map((c, ci) => (
                          <div key={`crit-${ci}`} className={styles.critItem}>
                            <div className={styles.critInfo}>
                              <span>{c.criterionName}</span>
                              <span>{c.score}</span>
                            </div>
                            <div className={styles.barBg}>
                              <div
                                className={styles.barFill}
                                style={{ width: `${(c.score / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className={styles.empty}>
                    {isFetchingDetails ? (
                      <div className={styles.loadingState}>
                        <Loader2 className={styles.spin} />
                        <p>Đang tải dữ liệu đánh giá...</p>
                      </div>
                    ) : (
                      "Chưa có đánh giá từ chuyên gia."
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RatingModal;