import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/SubmissionsReview.module.scss';

const SubmissionCard = ({ sub, onSelect }) => {
    return (
        <motion.div
            layoutId={`card-${sub.postId}`}
            className={styles.card}
            onClick={() => onSelect(sub)}
            whileHover={{ y: -5 }}
        >
            <div className={styles.imageArea}>
                <img 
                    src={sub.imageUrls?.[0] || 'https://via.placeholder.com/300?text=No+Image'} 
                    alt={sub.title} 
                    loading="lazy"
                />
                <div className={styles.cardOverlay}>
                    <button className={styles.btnOpen}>Chi tiết & Chấm điểm</button>
                </div>
                {sub.score !== null && <div className={styles.scoredBadge}>Đã chấm</div>}
            </div>
            
            <div className={styles.cardBody}>
                <h4 className={styles.postTitle}>{sub.title || "Không tiêu đề"}</h4>
                <div className={styles.userInfo}>
                    <img src={sub.avatarUrl || `https://ui-avatars.com/api/?name=${sub.userName}`} alt="" />
                    <span>{sub.userName}</span>
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.date}>{new Date(sub.createdAt).toLocaleDateString('vi-VN')}</span>
                    <div className={styles.scoreDisplay}>
                        <strong>{sub.score ?? '--'}</strong><span>/10</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SubmissionCard;