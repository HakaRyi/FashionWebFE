import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import styles from '../styles/SubmissionsReview.module.scss';

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
                    <h3>Chấm điểm bài thi</h3>
                    <small>Mã số: #{submission.postId}</small>
                </div>
                <button className={styles.btnClose} onClick={onClose} disabled={isSubmitting}>
                    <X size={24} />
                </button>
            </div>

            <div className={styles.panelScroll}>
                <div className={styles.previewSection}>
                    {submission.imageUrls && submission.imageUrls.length > 0 && (
                        <img src={submission.imageUrls[0]} alt="Preview" className={styles.mainImg} />
                    )}
                    <h4>{submission.title}</h4>
                    <p className={styles.contentDesc}>{submission.content}</p>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.criteriaSection}>
                        <h4 style={{ marginBottom: '12px' }}>Các tiêu chí đánh giá</h4>
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
                            <p>Sự kiện này chưa có tiêu chí đánh giá.</p>
                        )}
                        
                        {criteria && criteria.length > 0 && (
                            <div className={styles.totalScorePreview} style={{ marginTop: '10px', fontWeight: 'bold', color: '#4f46e5' }}>
                                Điểm tổng dự kiến: {calculatePreviewTotal()}
                            </div>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Nhận xét của chuyên gia</label>
                        <textarea
                            placeholder="Ghi chú về kỹ thuật, bố cục..."
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
                        {isSubmitting ? "Đang lưu..." : "Xác nhận điểm số"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewPanel;