import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, User, FileText, Star, ClipboardCheck } from 'lucide-react';
import styles from '../styles/ReviewPanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
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

    const handleScoreChange = (criterionId, rawValue) => {
        // 1. Cho phép xóa trống để người dùng nhập mới
        if (rawValue === "") {
            onScoreChange(criterionId, "");
            return;
        }

        let val = rawValue;
        const numericVal = parseFloat(val);

        // 2. Chặn khoảng giá trị từ 0 - 10
        if (numericVal < 0) val = "0";
        if (numericVal > 10) val = "10";

        // 3. Giới hạn 1 chữ số thập phân (ví dụ: 8.55 -> 8.6)
        if (val.includes('.') && val.split('.')[1].length > 2) {
            val = numericVal.toFixed(2);
        }

        onScoreChange(criterionId, val);
    };

    // Hàm chặn phím đặc biệt
    const blockInvalidChars = (e) => {
        if (["-", "+", "e", "E"].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                className={styles.mainContainer}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.infoSummary}>
                        <div className={styles.iconBadge}>
                            <ClipboardCheck color="#4f46e5" size={22} />
                        </div>
                        <div>
                            <h3>Submission Review</h3>
                            <p>
                                Entry ID: <span>#{submission.postId}</span>
                                <span className={styles.separator}>•</span>
                                Candidate: <strong>{submission.userName || 'Anonymous'}</strong>
                            </p>
                        </div>
                    </div>
                    <button className={styles.btnClose} onClick={onClose} disabled={isSubmitting}>
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.splitContent}>
                    {/* LEFT PANEL: CONTENT PREVIEW */}
                    <div className={styles.leftPanel}>
                        <div className={styles.mediaContainer}>
                            {submission.imageUrls && submission.imageUrls.length > 0 ? (
                                <Swiper
                                    modules={[Pagination, Navigation, Autoplay]}
                                    pagination={{ clickable: true, dynamicBullets: true }}
                                    navigation={true}
                                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                                    className={styles.mySwiper}
                                >
                                    {submission.imageUrls.map((url, idx) => (
                                        <SwiperSlide key={idx}>
                                            <div className={styles.slideWrapper}>
                                                <img src={url} alt={`Attachment ${idx + 1}`} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className={styles.noMedia}>
                                    <FileText size={48} />
                                    <p>No media attachments found</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.textContent}>
                            <h2 className={styles.postTitle}>{submission.title}</h2>
                            <div className={styles.authorMeta}>
                                <User size={14} />
                                <span>Published by <strong>{submission.userName}</strong> on {new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                            </div>
                            <article className={styles.postBody}>
                                {submission.content}
                            </article>
                        </div>
                    </div>

                    {/* RIGHT PANEL: EVALUATION FORM */}
                    <aside className={styles.rightPanel}>
                        <div className={styles.sectionHeader}>
                            <h4>Assessment Criteria</h4>
                            <span className={styles.badge}>Scale: 0 - 10</span>
                        </div>

                        <div className={styles.scrollableContent}>
                            <div className={styles.scoringList}>
                                {criteria?.length > 0 ? (
                                    criteria.map((c) => (
                                        <div className={styles.scoreCard} key={c.eventCriterionId}>
                                            <div className={styles.cardInfo}>
                                                <label>{c.name}</label>
                                                <span className={styles.weight}>Weight: {c.weightPercentage}%</span>
                                            </div>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min="0" max="10" step="0.1"
                                                    placeholder="0.0"
                                                    value={criterionScores[c.eventCriterionId] || ""}
                                                    onChange={(e) => handleScoreChange(c.eventCriterionId, e.target.value)}
                                                    onKeyDown={blockInvalidChars}
                                                    disabled={isSubmitting}
                                                />
                                                <div className={styles.unit}>pts</div>
                                            </div>
                                            {c.description && <p className={styles.criterionDesc}>{c.description}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.emptyState}>No criteria defined for this event.</div>
                                )}
                            </div>

                            <div className={styles.commentSection}>
                                <label>Expert Remarks</label>
                                <textarea
                                    placeholder="Write detailed feedback regarding technique, composition, or improvement..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Sticky Footer for Right Panel */}
                        <div className={styles.rightFooter}>
                            <div className={styles.totalBox}>
                                <div className={styles.totalInfo}>
                                    <span className={styles.label}>ESTIMATED TOTAL</span>
                                    <span className={styles.subLabel}>Based on weighted criteria</span>
                                </div>
                                <span className={styles.value}>{calculatePreviewTotal()}</span>
                            </div>
                            <button
                                className={styles.submitBtn}
                                onClick={onSubmit}
                                disabled={isSubmitting || !criteria?.length}
                            >
                                {isSubmitting ? (
                                    <Loader2 className={styles.spinner} size={20} />
                                ) : (
                                    <CheckCircle size={20} />
                                )}
                                <span>{isSubmitting ? "Processing..." : "Submit Grades"}</span>
                            </button>
                        </div>
                    </aside>
                </div>
            </motion.div >
        </div >
    );
};

export default ReviewPanel;