import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ArrowUpDown, AlertCircle, ChevronLeft, Loader2, Award } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

import { useExpertRating, expertRatingApi ,SubmissionCard, ReviewPanel} from '@/features/rating';

import styles from '@/features/rating/styles/SubmissionsReview.module.scss';

const SubmissionsReview = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    // Custom Hook quản lý dữ liệu
    const { submissions, isLoading, fetchMyReviews, updateLocalScore } = useExpertRating(eventId);

    // --- State local cho UI ---
    const [eventInfo, setEventInfo] = useState({ name: "Đang tải...", id: eventId });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState('newest');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    
    // State cho form đánh giá
    const [score, setScore] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tải dữ liệu khi mount
    useEffect(() => {
        fetchMyReviews();
    }, [fetchMyReviews]);

    // Cập nhật tên sự kiện từ dữ liệu trả về
    useEffect(() => {
        if (submissions.length > 0) {
            setEventInfo({ name: submissions[0].eventName, id: eventId });
        }
    }, [submissions, eventId]);

    // Đồng bộ form khi chọn bài thi
    useEffect(() => {
        if (selectedSubmission) {
            setScore(selectedSubmission.score !== null ? selectedSubmission.score.toString() : "");
            setComment(selectedSubmission.reason || "");
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

    // --- Xử lý chấm điểm ---
    const handleSubmitScore = async () => {
        const numericScore = parseFloat(score);
        if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
            return toast.warn("Điểm phải nằm trong khoảng từ 0 đến 10");
        }

        setIsSubmitting(true);
        const loadId = toast.loading("Đang lưu kết quả đánh giá...");

        try {
            await expertRatingApi.submitRating({
                postId: selectedSubmission.postId,
                score: numericScore,
                reason: comment
            });

            toast.update(loadId, {
                render: "Đã cập nhật đánh giá thành công!",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            // Cập nhật state local thông qua hook
            updateLocalScore(selectedSubmission.postId, numericScore, comment);
            
            setTimeout(() => setSelectedSubmission(null), 300);
        } catch (error) {
            toast.update(loadId, {
                render: "Lỗi: " + (error.response?.data?.message || "Không thể lưu điểm"),
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
                        <Award size={14} /> Hội đồng chuyên gia
                    </div>
                </div>

                <div className={styles.titleSection}>
                    <h1>{eventInfo.name}</h1>
                    <p>• Hệ thống quản lý chấm điểm</p>
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.filters}>
                        <div className={styles.searchBar}>
                            <Search size={16} />
                            <input
                                placeholder="Tìm tên thí sinh..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.sortBox}>
                            <ArrowUpDown size={16} />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="score">Điểm cao nhất</option>
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
                        <p>Đang tải dữ liệu bài thi...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className={styles.emptyState}>
                        <AlertCircle size={40} />
                        <p>{searchTerm ? "Không tìm thấy kết quả." : "Chưa có bài dự thi nào."}</p>
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
                            score={score}
                            setScore={setScore}
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