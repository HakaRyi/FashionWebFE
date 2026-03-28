import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Star, CheckCircle, Clock,
    ArrowUpDown, AlertCircle, X, Info, ChevronLeft
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

import styles from './SubmissionsReview.module.scss';

const SubmissionsReview = () => {
    const { eventId } = useParams(); // Lấy ID từ URL: /expert/events/:eventId/submissions
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState('deadline');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // State cho Form chấm điểm
    const [score, setScore] = useState("");
    const [comment, setComment] = useState("");

    // Mock Data mở rộng có ID sự kiện
    const allSubmissions = [
        {
            id: 1, eventId: "EVT001", user: 'Minh Anh', avatar: 'https://i.pravatar.cc/150?u=1',
            event: 'Street Style 2024', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
            status: 'pending', date: new Date('2026-03-21T14:00:00'), deadline: 2,
        },
        {
            id: 4, eventId: "EVT001", user: 'Quốc Khánh', avatar: 'https://i.pravatar.cc/150?u=4',
            event: 'Street Style 2024', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500',
            status: 'pending', date: new Date('2026-03-21T15:30:00'), deadline: 2,
        },
        {
            id: 2, eventId: "EVT002", user: 'Lê Nam', avatar: 'https://i.pravatar.cc/150?u=2',
            event: 'Minimalism Challenge', image: 'https://images.unsplash.com/photo-1539109132314-3475d24c2195?w=500',
            status: 'pending', date: new Date('2026-03-20T10:00:00'), deadline: 1,
        },
        // ... thêm các data khác tương ứng với ID bạn test
    ];

    // Lọc submission theo eventId hiện tại
    const currentEventSubmissions = useMemo(() => {
        return allSubmissions.filter(sub => sub.eventId === eventId || !eventId);
    }, [eventId]);

    const eventName = currentEventSubmissions[0]?.event || "Event Submissions";

    const filteredData = useMemo(() => {
        let result = currentEventSubmissions.filter(sub => {
            const matchesTab = sub.status === activeTab;
            const matchesSearch = sub.user.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });

        result.sort((a, b) => {
            if (sortBy === 'deadline') {
                const deadlineA = a.deadline ?? 99;
                const deadlineB = b.deadline ?? 99;
                return deadlineA - deadlineB;
            }
            if (sortBy === 'newest') return b.date - a.date;
            if (sortBy === 'oldest') return a.date - b.date;
            return 0;
        });

        return result;
    }, [currentEventSubmissions, activeTab, searchTerm, sortBy]);

    const handleSubmitScore = () => {
        if (!score || score < 0 || score > 10) {
            toast.warn("Vui lòng nhập điểm từ 0 đến 10!");
            return;
        }

        const loadId = toast.loading("Đang lưu kết quả...");
        setTimeout(() => {
            toast.update(loadId, {
                render: `Đã chấm ${score} điểm cho ${selectedSubmission.user}!`,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            setSelectedSubmission(null);
        }, 1000);
    };

    return (
        <div className={styles.reviewContainer}>
            <ToastContainer theme="colored" />

            <header className={styles.header}>
                <div className={styles.topNav}>
                    <button className={styles.btnBack} onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </button>
                    <div className={styles.badge}>Expert Panel</div>
                </div>

                <div className={styles.titleSection}>
                    <h1>{eventName}</h1>
                    <p>Mã sự kiện: <span>{eventId}</span> • Quản lý và đánh giá bài dự thi từ thí sinh.</p>
                </div>

                <div className={styles.toolbar}>
                    <nav className={styles.tabNav}>
                        <button
                            className={activeTab === 'pending' ? styles.active : ''}
                            onClick={() => setActiveTab('pending')}
                        >
                            Đang chờ ({currentEventSubmissions.filter(s => s.status === 'pending').length})
                        </button>
                        <button
                            className={activeTab === 'reviewed' ? styles.active : ''}
                            onClick={() => setActiveTab('reviewed')}
                        >
                            Đã chấm điểm
                        </button>
                    </nav>

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
                                <option value="deadline">Hạn chót</option>
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <main className={styles.content}>
                {filteredData.length === 0 ? (
                    <div className={styles.emptyState}>
                        <AlertCircle size={40} />
                        <p>Không có bài dự thi nào trong mục này.</p>
                    </div>
                ) : (
                    <div className={styles.submissionGrid}>
                        {filteredData.map((sub) => (
                            <motion.div
                                key={sub.id}
                                layoutId={sub.id}
                                className={styles.card}
                                onClick={() => setSelectedSubmission(sub)}
                            >
                                <div className={styles.imageArea}>
                                    <img src={sub.image} alt="Submission" />
                                    {sub.deadline <= 1 && sub.status === 'pending' && (
                                        <span className={styles.urgentTag}>Sắp hết hạn</span>
                                    )}
                                    <div className={styles.cardOverlay}>
                                        <span>Xem chi tiết</span>
                                    </div>
                                </div>
                                <div className={styles.cardInfo}>
                                    <div className={styles.user}>
                                        <img src={sub.avatar} alt="Avatar" />
                                        <div>
                                            <h4>{sub.user}</h4>
                                            <small>{sub.date.toLocaleDateString('vi-VN')}</small>
                                        </div>
                                    </div>
                                    {sub.status === 'reviewed' && (
                                        <div className={styles.finalScore}>
                                            {sub.score}<span>/10</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {selectedSubmission && (
                    <>
                        <motion.div
                            className={styles.modalOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSubmission(null)}
                        />
                        <motion.div
                            className={styles.reviewPanel}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                        >
                            <button className={styles.btnClose} onClick={() => setSelectedSubmission(null)}>
                                <X size={20} />
                            </button>

                            <div className={styles.panelContent}>
                                <h3>Đánh giá bài thi</h3>
                                <div className={styles.mainImage}>
                                    <img src={selectedSubmission.image} alt="Full view" />
                                </div>

                                <div className={styles.formSection}>
                                    <div className={styles.infoRow}>
                                        <label>Thí sinh:</label>
                                        <span>{selectedSubmission.user}</span>
                                    </div>

                                    <div className={styles.inputField}>
                                        <label>Chấm điểm (0 - 10)</label>
                                        <input
                                            type="number"
                                            placeholder="Nhập số điểm..."
                                            value={score}
                                            onChange={(e) => setScore(e.target.value)}
                                            autoFocus
                                        />
                                    </div>

                                    <div className={styles.inputField}>
                                        <label>Nhận xét chuyên môn</label>
                                        <textarea
                                            placeholder="Ghi chú về kỹ thuật, màu sắc, bố cục..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={5}
                                        />
                                    </div>

                                    <button className={styles.submitBtn} onClick={handleSubmitScore}>
                                        Gửi đánh giá <CheckCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubmissionsReview;