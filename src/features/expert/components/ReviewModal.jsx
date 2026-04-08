import React from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Sparkles, FileText, Globe, User } from 'lucide-react';
import styles from '../styles/ReviewModal.module.scss';

const ReviewModal = ({ data, onClose }) => {
    if (!data) return null;

    // Các mục hiển thị trong modal
    const infoItems = [
        {
            icon: <User size={18} />,
            label: "Expert Role",
            value: data.style
        },
        {
            icon: <Sparkles size={18} />,
            label: "Fashion Aesthetic",
            value: data.styleAesthetic
        },
        {
            icon: <Briefcase size={18} />,
            label: "Experience",
            value: `${data.yearsOfExperience} Year(s)`
        }
    ];

    return (
        <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerTitle}>
                        <div className={styles.iconWrapper}>
                            <FileText size={20} color="#c5a059" />
                        </div>
                        <h3>Application Review</h3>
                    </div>
                    <button className={styles.btnClose} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.modalBody}>
                    <div className={styles.infoGrid}>
                        {infoItems.map((item, index) => (
                            <div key={index} className={styles.reviewField}>
                                <div className={styles.fieldLabel}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                <div className={styles.fieldValue}>{item.value || 'N/A'}</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.reviewField}>
                        <div className={styles.fieldLabel}>
                            <FileText size={18} />
                            <span>Bio / Philosophy</span>
                        </div>
                        <p className={styles.fieldValueBox}>
                            {data.bio || "No biography provided for this application."}
                        </p>
                    </div>

                    <div className={styles.reviewField}>
                        <div className={styles.fieldLabel}>
                            <Globe size={18} />
                            <span>Portfolio & Evidence</span>
                        </div>
                        <a
                            href={data.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.portfolioCard}
                        >
                            <span className={styles.linkText}>View attached documents</span>
                            <span className={styles.linkHint}>External Link</span>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onClose}>
                        Close Preview
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ReviewModal;