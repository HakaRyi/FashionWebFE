import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X, Heart, Award, Calendar, Loader2,
  Share2, Info, Users, ArrowRight
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import { getEventApi } from '../api/getEvent';
import { formatDate } from '../utils/formatValue';
import styles from '../styles/RatingModal.module.scss';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const RatingModal = ({ post, onClose, eventWeights, eventInfo }) => {
  const [data, setData] = useState(post);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!post?.postId) return;

    const fetchExtraDetails = async () => {
      setIsFetchingDetails(true);
      try {
        const res = await getEventApi.getPostRatingDetails(post.postId);
        const details = res.data || res;
        setData(prev => ({ ...prev, ...details }));
      } catch (err) {
        console.error("Error loading appraisal details:", err);
      } finally {
        setIsFetchingDetails(false);
      }
    };

    fetchExtraDetails();
  }, [post?.postId]);

  const formatScore = useCallback((val, digits = 1) => {
    if (val === null || val === undefined) return "0.0";
    return Number(val).toFixed(digits);
  }, []);

  if (!post) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.98 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
        {/* Superior Close Control */}
        <button onClick={onClose} className={styles.closeBtn}>
          <X className={styles.closeIcon} />
        </button>

        <div className={styles.mainLayout}>
          {/* LEFT: VISUAL NARRATIVE */}
          <section className={styles.visualSection}>
            <div className={styles.imageGallery}>
              {data?.imageUrls?.length > 1 ? (
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  navigation={true}
                  style={{ height: '100%' }}
                >
                  {data.imageUrls.map((url, i) => (
                    <SwiperSlide key={i}>
                      <div className={styles.slideWrapper}>
                        <img src={url} alt={`slide-${i}`} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className={styles.slideWrapper}>
                  <img src={data?.imageUrl || data?.imageUrls?.[0] || '/placeholder.png'} alt="post" />
                </div>
              )}

              <div className={styles.premiumTag}>
                <div className={styles.pulseDot} />
                Premium Record {data?.rank || '0'}
              </div>
            </div>

            <div className={styles.contextBar}>
              <div className={styles.headerRow}>
                <div className={styles.userInfo}>
                  <div className={styles.avatarFrame}>
                    <img
                      src={data?.avatarUrl || data?.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data?.userName}`}
                      alt={data?.userName}
                    />
                  </div>
                  <div className={styles.userMeta}>
                    <h4>{data?.userName}</h4>
                    <div className={styles.subMeta}>
                      <span><Calendar size={14} style={{ marginRight: '4px' }} /> {formatDate(data?.createdAt)}</span>
                      <div className={styles.dot} />
                      <span>Archive ID: {data?.postId ? String(data.postId).slice(0, 8) : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.quickStats}>
                  <div className={styles.statChip}>
                    <Heart className={styles.statIcon} />
                    <span>{data?.finalLikeCount || data?.likeCount || 0}</span>
                  </div>
                  <div className={styles.statChip}>
                    <Share2 className={styles.statIcon} />
                    <span>{data?.finalShareCount || data?.shareCount || 0}</span>
                  </div>
                </div>
              </div>

              <div className={styles.contentText}>
                <h3>{data?.title}</h3>
                <p>{data?.content || data?.description || "No abstract provided for this archival entry."}</p>
              </div>
            </div>
          </section>

          {/* RIGHT: APPRAISAL & ANALYSIS */}
          <section className={styles.analysisSection}>
            <span className={styles.eyebrow}>Evaluative Transcript </span>

            <div className={styles.scoreHero}>
              <div className={styles.scoreCircle}>
                <div className={styles.innerRing} />
                <span className={styles.scoreVal}>{formatScore(data?.finalScore || data?.score)}</span>
                <span className={styles.scoreLabel}>Rating</span>
              </div>

              <div className={styles.scoreInfo}>
                <h4 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Consolidated Rating</h4>
                <p style={{ fontSize: '12px', opacity: 0.5 }}>
                  Weight: {Math.round(eventWeights?.expertWeight * 100 || 0)}% Expert / {Math.round(eventWeights?.userWeight * 100 || 0)}% Community
                </p>
              </div>
            </div>

            {data?.canSeeDetails ? (
              <div className={styles.detailsContent}>
                <div className={styles.authorityGrid}>
                  <div className={styles.tileCommunal}>
                    <Users className={styles.tileIcon} />
                    <label>Communal Score</label>
                    <div className={styles.val}>{formatScore(data?.communityScore)}</div>
                    <p>Public Resonance Weighted</p>
                  </div>

                  <div className={styles.tileExpert}>
                    <Award className={styles.tileIcon} />
                    <label>Expert Score</label>
                    <div className={styles.val}>{formatScore(data?.expertTotalScore)}</div>
                    <p>Panel Authority Weighted</p>
                  </div>
                </div>

                <div className={styles.testimonials}>
                  <div className={styles.sectionDivider}>
                    <div className={styles.line} />
                    <h3>Critical Testimony</h3>
                    <div className={styles.line} />
                  </div>

                  <div className={styles.reviewList}>
                    {data?.expertReviews?.map((review, idx) => (
                      <article key={idx} className={styles.reviewArticle}>
                        <div className={styles.timelineLine} />
                        <div className={styles.timelineDot} />

                        <div className={styles.reviewTop}>
                          <div className={styles.expertInfo}>
                            <div className={styles.expertBadge}><Award size={18} /></div>
                            <div className={styles.nameStack}>
                              <span>{review.expertName}</span>
                              <small>Associate Juror</small>
                            </div>
                          </div>
                          <div className={styles.givenScore}>{review.totalScoreGiven}/10</div>
                        </div>

                        <blockquote className={styles.quote}>
                          "{review.reason || 'No qualitative justification submitted.'}"
                        </blockquote>

                        <div className={styles.criteriaGrid}>
                          {review.criteriaScores?.map((c, ci) => (
                            <div key={ci} className={styles.criterion}>
                              <div className={styles.labelRow}>
                                <span>{c.criterionName}</span>
                                <span>{c.score}</span>
                              </div>
                              <div className={styles.barTrack}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(c.score / 10) * 100}%` }}
                                  className={styles.barFill}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                    {isFetchingDetails && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                        <Loader2 className="animate-spin" />
                        <span>Synchronizing Appraisal Data...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.restrictedView}>
                <div className={styles.lockWrapper}>
                  <div className={styles.lockIconBox}><Info size={40} /></div>
                  <div className={styles.glow} />
                </div>

                <h3>Granular Detail Restricted</h3>
                <p className={styles.notice}>In accordance with system-wide privacy guidelines, the verbatim remarks and sub-criteria scores of the panel are designated as non-public.</p>

                <div className={styles.panelVerification}>
                  <span className={styles.verifyLabel}>Panel Verification Issued By:</span>
                  <div className={styles.membersList}>
                    {(eventInfo?.experts || data?.expertReviews)?.map((ex, i) => (
                      <div key={i} className={styles.memberChip}>
                        <div className={styles.memberAvatar}>
                          <img src={ex.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ex.fullName || ex.expertName}`} alt="avatar" />
                        </div>
                        <span>{ex.fullName || ex.expertName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.modalFooter}>
              <button onClick={onClose} className={styles.closeRecordBtn}>
                <div className={styles.btnBg} />
                <div className={styles.btnContent}>
                  <span>Close Appraisal Record</span>
                  <ArrowRight className={styles.arrow} />
                </div>
              </button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default RatingModal;