import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Star, CheckCircle, Clock,
    ArrowUpDown, AlertCircle, X, Info, Layers
} from 'lucide-react';
import styles from './SubmissionsReview.module.scss';
import { ToastContainer, toast } from 'react-toastify';

const SubmissionsReview = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState('deadline');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // State cho Form chấm điểm
    const [score, setScore] = useState("");
    const [comment, setComment] = useState("");

    const submissions = [
        {
            id: 1, user: 'Minh Anh', avatar: 'https://i.pravatar.cc/150?u=1',
            event: 'Street Style 2024', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
            status: 'pending', date: new Date('2026-03-21T14:00:00'), deadline: 2,
        },
        {
            id: 4, user: 'Quốc Khánh', avatar: 'https://i.pravatar.cc/150?u=4',
            event: 'Street Style 2024', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500',
            status: 'pending', date: new Date('2026-03-21T15:30:00'), deadline: 2,
        },
        {
            id: 2, user: 'Lê Nam', avatar: 'https://i.pravatar.cc/150?u=2',
            event: 'Minimalism Challenge', image: 'https://images.unsplash.com/photo-1539109132314-3475d24c2195?w=500',
            status: 'pending', date: new Date('2026-03-20T10:00:00'), deadline: 1,
        },
        {
            id: 5, user: 'Thanh Thảo', avatar: 'https://i.pravatar.cc/150?u=5',
            event: 'Minimalism Challenge', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
            status: 'pending', date: new Date('2026-03-19T08:00:00'), deadline: 1,
        },
        {
            id: 6, user: 'Hoàng Long', avatar: 'https://i.pravatar.cc/150?u=6',
            event: 'Techwear Future', image: 'https://images.unsplash.com/photo-1507702553912-a15641e72718?w=500',
            status: 'pending', date: new Date('2026-03-18T12:00:00'), deadline: 5,
        },
        {
            id: 3, user: 'Hoàng Yến', avatar: 'https://i.pravatar.cc/150?u=3',
            event: 'Street Style 2024', image: 'https://images.unsplash.com/photo-1529139513055-07f9127e6193?w=500',
            status: 'reviewed', score: 8.5, date: new Date('2026-03-18T09:00:00'),
        }
    ];

    // Logic xử lý dữ liệu: Filter -> Sort -> Group
    const groupedData = useMemo(() => {
        let filtered = submissions.filter(sub => {
            const matchesTab = sub.status === activeTab;
            const matchesSearch = sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.event.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });

        filtered.sort((a, b) => {
            if (sortBy === 'deadline') {
                // Nếu là tab pending, ưu tiên deadline thấp (1 ngày < 2 ngày)
                // Nếu không có deadline (bài đã chấm), đẩy xuống cuối bằng cách gán số lớn (99)
                const deadlineA = a.deadline !== undefined ? a.deadline : 99;
                const deadlineB = b.deadline !== undefined ? b.deadline : 99;

                if (deadlineA !== deadlineB) return deadlineA - deadlineB;
                // Nếu cùng deadline, bài nào nộp trước (oldest) xử lý trước
                return a.date - b.date;
            }

            if (sortBy === 'newest') return b.date - a.date;
            if (sortBy === 'oldest') return a.date - b.date;
            return 0;
        });

        return filtered.reduce((acc, sub) => {
            if (!acc[sub.event]) acc[sub.event] = [];
            acc[sub.event].push(sub);
            return acc;
        }, {});
    }, [activeTab, searchTerm, sortBy]);

    const handleOpenReview = (sub) => {
        setSelectedSubmission(sub);
        setScore(sub.score || ""); // Load điểm cũ nếu có
        setComment("");
    };

    const handleSubmitScore = () => {
        // Validation nhanh
        if (!score || score < 0 || score > 10) {
            toast.warn("Vui lòng nhập điểm từ 0 đến 10!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Hiệu ứng loading giả lập
        const id = toast.loading("Đang lưu kết quả...");

        setTimeout(() => {
            // Cập nhật toast thành công
            toast.update(id, {
                render: `Đã chấm ${score} điểm cho ${selectedSubmission.user}!`,
                type: "success",
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                draggable: true
            });

            // Đóng panel và reset form
            setSelectedSubmission(null);
            setScore("");
            setComment("");
        }, 1200);
    };

    return (
        <div className={styles.reviewContainer}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Submissions Review</h1>
                    <p>Hệ thống đánh giá chuyên gia cho các sự kiện thời trang.</p>
                </div>

                <div className={styles.actionGroup}>
                    <div className={styles.searchBar}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm thí sinh hoặc sự kiện..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={styles.sortDropdown}>
                        <ArrowUpDown size={18} />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="deadline">Gần hết hạn</option>
                        </select>
                    </div>
                </div>
            </header>

            <nav className={styles.tabNav}>
                <button
                    className={activeTab === 'pending' ? styles.active : ''}
                    onClick={() => setActiveTab('pending')}
                >
                    Đợi chấm điểm <span className={styles.badge}>{submissions.filter(s => s.status === 'pending').length}</span>
                </button>
                <button
                    className={activeTab === 'reviewed' ? styles.active : ''}
                    onClick={() => setActiveTab('reviewed')}
                >
                    Đã hoàn thành
                </button>
            </nav>

            <main className={styles.content}>
                {Object.keys(groupedData).length === 0 ? (
                    <div className={styles.emptyState}>Không tìm thấy bài dự thi nào.</div>
                ) : (
                    Object.entries(groupedData).map(([eventName, items]) => (
                        <section key={eventName} className={styles.eventSection}>
                            <div className={styles.eventHeader}>
                                <Layers size={20} className={styles.eventIcon} />
                                <h2>{eventName}</h2>
                                <span className={styles.countBadge}>{items.length} bài thi</span>
                            </div>

                            <div className={styles.grid}>
                                {items.map((sub) => (
                                    <motion.div
                                        key={sub.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={styles.submissionCard}
                                        onClick={() => handleOpenReview(sub)}
                                    >
                                        <div className={styles.imageWrapper}>
                                            <img src={sub.image} alt="Work" />
                                            {sub.deadline <= 1 && activeTab === 'pending' && (
                                                <div className={styles.urgentBadge}>
                                                    <Clock size={12} /> Gấp
                                                </div>
                                            )}
                                            <div className={styles.overlay}>
                                                <button><Star size={18} /> Review Now</button>
                                            </div>
                                        </div>

                                        <div className={styles.cardContent}>
                                            <div className={styles.userInfo}>
                                                <img src={sub.avatar} alt={sub.user} />
                                                <div className={styles.text}>
                                                    <h4>{sub.user}</h4>
                                                    <span>{sub.date.toLocaleDateString('vi-VN')}</span>
                                                </div>
                                            </div>
                                            {activeTab === 'reviewed' && (
                                                <div className={styles.scoreResult}>
                                                    Điểm: <strong>{sub.score}/10</strong>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    ))
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
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <button className={styles.btnClose} onClick={() => setSelectedSubmission(null)}>
                                <X size={20} />
                            </button>

                            <div className={styles.panelHeader}>
                                <h2>Đánh giá tác phẩm</h2>
                                <p>Thí sinh: <strong>{selectedSubmission.user}</strong></p>
                            </div>

                            <div className={styles.panelBody}>
                                <div className={styles.imageContainer}>
                                    <img src={selectedSubmission.image} alt="Submission preview" />
                                    <div className={styles.eventInfoTag}>
                                        <Info size={14} /> {selectedSubmission.event}
                                    </div>
                                </div>

                                <div className={styles.gradingForm}>
                                    <div className={styles.inputGroup}>
                                        <label>Thang điểm (1 - 10)</label>
                                        <input
                                            type="number"
                                            step="0.1" // Cho phép nhập số thập phân như 8.5
                                            min="0"
                                            max="10"
                                            value={score}
                                            onChange={(e) => setScore(e.target.value)}
                                            placeholder="8.5"
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Nhận xét từ chuyên gia</label>
                                        <textarea
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Phối màu tốt, tuy nhiên cần chú ý hơn về chất liệu..."
                                        />
                                    </div>

                                    <div className={styles.rubricNote}>
                                        <AlertCircle size={16} />
                                        <span>Bài chấm sẽ không được sửa sau khi gửi.</span>
                                    </div>

                                    <button
                                        className={styles.btnSubmit}
                                        onClick={handleSubmitScore}
                                    >
                                        Hoàn tất chấm điểm <CheckCircle size={18} />
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