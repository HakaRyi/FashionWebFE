import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    Star, 
    MessageSquare, 
    CheckCircle, 
    Clock, 
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import styles from './SubmissionsReview.module.scss';

const SubmissionsReview = () => {
    const [activeTab, setActiveTab] = useState('pending'); // pending | reviewed
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Mock data bài dự thi
    const submissions = [
        { 
            id: 1, 
            user: 'Minh Anh', 
            avatar: 'https://i.pravatar.cc/150?u=1',
            event: 'Street Style 2024',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
            status: 'pending',
            date: '2 giờ trước'
        },
        { 
            id: 2, 
            user: 'Lê Nam', 
            avatar: 'https://i.pravatar.cc/150?u=2',
            event: 'Minimalism Challenge',
            image: 'https://images.unsplash.com/photo-1539109132314-3475d24c2195?w=500',
            status: 'pending',
            date: '5 giờ trước'
        }
    ];

    return (
        <div className={styles.reviewContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Submissions Review</h1>
                    <p>Đánh giá năng lực và chấm điểm các bài dự thi từ cộng đồng.</p>
                </div>
                
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input type="text" placeholder="Tìm tên user hoặc sự kiện..." />
                </div>
            </header>

            {/* TABS NAVE */}
            <div className={styles.tabNav}>
                <button 
                    className={activeTab === 'pending' ? styles.active : ''} 
                    onClick={() => setActiveTab('pending')}
                >
                    Chờ chấm điểm <span className={styles.badge}>12</span>
                </button>
                <button 
                    className={activeTab === 'reviewed' ? styles.active : ''} 
                    onClick={() => setActiveTab('reviewed')}
                >
                    Đã hoàn thành
                </button>
            </div>

            {/* LIST GRID */}
            <div className={styles.grid}>
                {submissions.map((sub) => (
                    <motion.div 
                        key={sub.id} 
                        layoutId={`card-${sub.id}`}
                        className={styles.submissionCard}
                        onClick={() => setSelectedSubmission(sub)}
                    >
                        <div className={styles.imageWrapper}>
                            <img src={sub.image} alt="Submission" />
                            <div className={styles.overlay}>
                                <button><Star size={20} /> Chấm điểm ngay</button>
                            </div>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.userInfo}>
                                <img src={sub.avatar} alt="Avatar" />
                                <div>
                                    <h4>{sub.user}</h4>
                                    <span>{sub.date}</span>
                                </div>
                            </div>
                            <p className={styles.eventName}>📌 {sub.event}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* MODAL CHẤM ĐIỂM (QUICK REVIEW) */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedSubmission(null)}>
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className={styles.reviewPanel}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.btnClose} onClick={() => setSelectedSubmission(null)}>×</button>
                            
                            <div className={styles.panelContent}>
                                <img src={selectedSubmission.image} className={styles.previewImg} alt="" />
                                
                                <div className={styles.gradingForm}>
                                    <h3>Chấm điểm chuyên gia</h3>
                                    <p>Tỷ trọng điểm của bạn: <strong>70%</strong></p>

                                    <div className={styles.inputGroup}>
                                        <label>Thang điểm (1-10)</label>
                                        <input type="number" min="1" max="10" placeholder="Nhập điểm..." />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Nhận xét chuyên môn</label>
                                        <textarea rows="4" placeholder="Viết vài lời khuyên cho thí sinh..." />
                                    </div>

                                    <button className={styles.btnSubmit}>
                                        Xác nhận kết quả <CheckCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubmissionsReview;