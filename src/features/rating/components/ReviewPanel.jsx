import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import styles from '../styles/SubmissionsReview.module.scss';

const ReviewPanel = ({ 
    submission, 
    score, 
    setScore, 
    comment, 
    setComment, 
    onClose, 
    onSubmit, 
    isSubmitting 
}) => {
    if (!submission) return null;

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
                    <img src={submission.imageUrls?.[0]} alt="Preview" className={styles.mainImg} />
                    <h4>{submission.title}</h4>
                    <p className={styles.contentDesc}>{submission.content}</p>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.inputGroup}>
                        <label>Điểm chuyên môn (0 - 10)</label>
                        <input
                            type="number"
                            min="0" max="10" step="0.1"
                            placeholder="8.5"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            autoFocus
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Nhận xét của chuyên gia</label>
                        <textarea
                            placeholder="Ghi chú về kỹ thuật, bố cục..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                        />
                    </div>

                    <button 
                        className={styles.submitBtn} 
                        onClick={onSubmit}
                        disabled={isSubmitting}
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