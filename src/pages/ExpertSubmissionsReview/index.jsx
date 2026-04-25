import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ArrowUpDown, AlertCircle, ChevronLeft, Loader2, Award } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

import { useExpertRating, expertRatingApi, SubmissionCard, ReviewPanel } from '@/features/rating';
import { useEventStore } from '@/features/events';

import styles from '@/features/rating/styles/SubmissionsReview.module.scss';

const SubmissionsReview = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const { currentEvent, fetchEventDetail, clearCurrentEvent, isLoading: isEventLoading } = useEventStore();

    const { submissions, criteria, isLoading, fetchMyReviews, updateLocalScore } = useExpertRating(eventId);

    // --- State local cho UI ---
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState('newest');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // State cho form đánh giá
    const [criterionScores, setCriterionScores] = useState({});
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tải dữ liệu khi mount
    useEffect(() => {
        fetchEventDetail(eventId);
        fetchMyReviews();
        return () => {
            if (clearCurrentEvent) clearCurrentEvent();
        };
    }, [eventId, fetchEventDetail, fetchMyReviews, clearCurrentEvent]);

    // Đồng bộ form khi chọn bài thi
    useEffect(() => {
        if (selectedSubmission) {
            setComment(selectedSubmission.reason || "");

            // Map điểm cũ vào form nếu đã từng chấm
            const initialScores = {};
            if (selectedSubmission.criterionRatings) {
                selectedSubmission.criterionRatings?.forEach(c => {
                    initialScores[c.eventCriterionId] = c.score;
                });
            }
            setCriterionScores(initialScores);
        }
    }, [selectedSubmission]);

    // --- Logic: Filter & Sort ---
    const filteredData = useMemo(() => {
        return submissions
            .filter(sub => {
                const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.title?.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
                if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
                if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
                return 0;
            });
    }, [submissions, searchTerm, sortBy]);

    const handleScoreChange = (criterionId, value) => {
        setCriterionScores(prev => ({
            ...prev,
            [criterionId]: value
        }));
    };

    // --- Xử lý chấm điểm ---
    const handleSubmitScore = async () => {
        const ratingsPayload = [];
        let calculatedTotalScore = 0;

        for (const c of criteria) {
            const val = parseFloat(criterionScores[c.eventCriterionId]);
            if (isNaN(val) || val < 0 || val > 10) {
                return toast.warn(`Please give a valid score (0 - 10) for each criterion: ${c.name}`);
            }
            ratingsPayload.push({
                eventCriterionId: c.eventCriterionId,
                score: val
            });
            calculatedTotalScore += (val * c.weightPercentage) / 100.0;
        }

        setIsSubmitting(true);
        const loadId = toast.loading("Saving the evaluation results....");

        try {
            await expertRatingApi.submitRating({
                postId: selectedSubmission.postId,
                reason: comment,
                criterionRatings: ratingsPayload
            });

            toast.update(loadId, {
                render: "Evaluation results saved successfully!",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            updateLocalScore(selectedSubmission.postId, calculatedTotalScore, comment, ratingsPayload);

            setTimeout(() => setSelectedSubmission(null), 300);
        } catch (error) {
            toast.update(loadId, {
                render: "Error: " + (error.response?.data?.message || "Cannot save score"),
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.reviewContainer}>
            <ToastContainer position="top-right" theme="colored" />

            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.topNav}>
                    <button className={styles.btnBack} onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} /> Quay lại
                    </button>
                    <div className={styles.badge}>
                        <Award size={14} /> Expert panel
                    </div>
                </div>

                <div className={styles.titleSection}>
                    <h1>{currentEvent?.title || (isEventLoading ? "Loading..." : "Event Review")}</h1>
                    <p>• Expert Evaluation System</p>
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.filters}>
                        <div className={styles.searchBar}>
                            <Search size={16} />
                            <input
                                placeholder="Search contestant names..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.sortBox}>
                            <ArrowUpDown size={16} />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">Latest</option>
                                <option value="oldest">Oldest</option>
                                <option value="score">Highest Score</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.content}>
                {isLoading ? (
                    <div className={styles.loadingState}>
                        <Loader2 className={styles.spinner} size={40} />
                        <p>Loading submission data...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className={styles.emptyState}>
                        <AlertCircle size={40} />
                        <p>{searchTerm ? "No results found." : "No submissions available."}</p>
                    </div>
                ) : (
                    <div className={styles.submissionGrid}>
                        {filteredData.map((sub) => (
                            <SubmissionCard
                                key={sub.postId}
                                sub={sub}
                                onSelect={setSelectedSubmission}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Review Panel Drawer */}
            <AnimatePresence>
                {selectedSubmission && (
                    <>
                        <motion.div
                            className={styles.modalOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setSelectedSubmission(null)}
                        />
                        <ReviewPanel
                            submission={selectedSubmission}
                            criteria={criteria}
                            criterionScores={criterionScores}
                            onScoreChange={handleScoreChange}
                            comment={comment}
                            setComment={setComment}
                            isSubmitting={isSubmitting}
                            onClose={() => setSelectedSubmission(null)}
                            onSubmit={handleSubmitScore}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubmissionsReview;