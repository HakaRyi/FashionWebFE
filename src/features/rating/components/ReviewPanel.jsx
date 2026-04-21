import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import styles from '../styles/SubmissionsReview.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ReviewPanel = ({
    submission,
    criteria,
    criterionScores,
    onScoreChange,
    comment,
    setComment,
    onClose,
    onSubmit,
    isSubmitting
}) => {
    if (!submission) return null;

    const calculatePreviewTotal = () => {
        if (!criteria || criteria.length === 0) return 0;
        let total = 0;
        criteria.forEach(c => {
            const score = parseFloat(criterionScores[c.eventCriterionId]) || 0;
            total += (score * c.weightPercentage) / 100.0;
        });
        return total.toFixed(2);
    };

    return (
        <motion.div
            className={styles.reviewPanel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
            <div className={styles.panelHeader}>
                <div>
                    <h3>Grading the exam</h3>
                    <small>Code number: #{submission.postId}</small>
                </div>
                <button className={styles.btnClose} onClick={onClose} disabled={isSubmitting}>
                    <X size={24} />
                </button>
            </div>

            <div className={styles.panelScroll}>
                <div className={styles.previewSection}>
                    <div className={styles.imageGallery}>
                        {submission.imageUrls && submission.imageUrls.length > 0 ? (
                            submission.imageUrls.length > 1 ? (
                                <Swiper
                                    modules={[Pagination, Navigation]}
                                    pagination={{ clickable: true }}
                                    navigation={true}
                                    className={styles.reviewSwiper}
                                >
                                    {submission.imageUrls.map((url, idx) => (
                                        <SwiperSlide key={idx}>
                                            <img
                                                src={url}
                                                alt={`Slide ${idx}`}
                                                className={styles.mainImg}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <img
                                    src={submission.imageUrls[0]}
                                    alt="Preview"
                                    className={styles.mainImg}
                                />
                            )
                        ) : (
                            <div className={styles.noImage}>No images available</div>
                        )}
                    </div>
                    <h4>{submission.title}</h4>
                    <p className={styles.contentDesc}>{submission.content}</p>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.criteriaSection}>
                        <h4 style={{ marginBottom: '12px' }}>Evaluation Criteria</h4>
                        {criteria && criteria.length > 0 ? (
                            criteria.map((c) => (
                                <div className={styles.inputGroup} key={c.eventCriterionId}>
                                    <label>
                                        {c.name} ({c.weightPercentage}%)
                                        {c.description && <span className={styles.descTooltip}> - {c.description}</span>}
                                    </label>
                                    <input
                                        type="number"
                                        min="0" max="10" step="0.1"
                                        placeholder="0 - 10"
                                        value={criterionScores[c.eventCriterionId] || ""}
                                        onChange={(e) => onScoreChange(c.eventCriterionId, e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>This event does not have any evaluation criteria yet.</p>
                        )}

                        {criteria && criteria.length > 0 && (
                            <div className={styles.totalScorePreview} style={{ marginTop: '10px', fontWeight: 'bold', color: '#4f46e5' }}>
                                Preview Total Score: {calculatePreviewTotal()}
                            </div>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Expert Comments</label>
                        <textarea
                            placeholder="Notes about technique, composition..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        className={styles.submitBtn}
                        onClick={onSubmit}
                        disabled={isSubmitting || !criteria || criteria.length === 0}
                    >
                        {isSubmitting ? <Loader2 className={styles.spinner} size={18} /> : <CheckCircle size={18} />}
                        {isSubmitting ? "Saving..." : "Confirm Scores"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewPanel;