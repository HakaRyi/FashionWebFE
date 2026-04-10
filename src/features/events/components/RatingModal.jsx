import React, { useState, useEffect } from 'react';
import { getEventApi } from '../api/getEvent';
import { formatDate } from '../utils/formatValue';
import styles from '../styles/RatingModal.module.scss';

const RatingModal = ({ postId, onClose, eventWeights }) => {
  const [postDetails, setPostDetails] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const formatScore = (val, digits = 2) => {
    if (val === null || val === undefined) return "0";
    return Number(val).toFixed(digits).replace(/\.?0+$/, '');
  };

  useEffect(() => {
    if (!postId) return;

    const fetchPostDetails = async () => {
      setIsModalLoading(true);
      try {
        const res = await getEventApi.getPostRatingDetails(postId);
        setPostDetails(res.data || res);
      } catch (err) {
        console.error("Lỗi tải chi tiết điểm:", err);
      } finally {
        setIsModalLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (!postId) return null;

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
        <button className={styles['btn-close']} onClick={onClose}>✕</button>

        {isModalLoading ? (
          <div className="p-10 text-center">Đang truy xuất bảng điểm...</div>
        ) : (
          <>
            <div className={styles['modal-header']}>
              <h2>Báo Cáo Thẩm Định</h2>
              <p>{postDetails?.title}</p>

              <div className={styles['score-breakdown']}>
                <div className={styles['score-item']}>
                  <label>Cộng đồng ({eventWeights?.userWeight * 100}%)</label>
                  <strong>{formatScore(postDetails?.communityScore)}</strong>
                </div>
                <div className={styles['score-item']}>
                  <label>Hội đồng ({eventWeights?.expertWeight * 100}%)</label>
                  <strong>{formatScore(postDetails?.expertTotalScore)}</strong>
                </div>
                <div className={`${styles['score-item']} ${styles.final}`}>
                  <label>Tổng điểm</label>
                  <strong>{formatScore(postDetails?.finalScore, 3)}</strong>
                </div>
              </div>
            </div>

            <div className={styles['modal-body']}>
              <h3>Chi tiết đánh giá từ chuyên gia</h3>
              {postDetails?.expertReviews?.length > 0 ? (
                postDetails.expertReviews.map((review, idx) => (
                  <div key={idx} className={styles['review-card']}>
                    <div className={styles['review-header']}>
                      <div>
                        <strong>{review.expertName}</strong>
                        <span className={styles.date}>{formatDate(review.ratedAt)}</span>
                      </div>
                      <div className={styles.totalGiven}>{review.totalScoreGiven}/10</div>
                    </div>
                    <p className={styles.reason}>"{review.reason || 'Không có nhận xét'}"</p>
                    <div className={styles['criteria-list']}>
                      {review.criteriaScores?.map((c, ci) => (
                        <div key={ci} className={styles.criterion}>
                          <span>{c.criterionName} ({c.weightPercentage}%)</span>
                          <div className={styles.barContainer}>
                            <div className={styles.bar} style={{ width: `${(c.score || 0) * 10}%` }}></div>
                            <span className={styles.cScore}>{c.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center italic">Chưa có đánh giá từ chuyên gia.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingModal;