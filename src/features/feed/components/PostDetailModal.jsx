import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import PostContent from './PostContent';
import styles from '../styles/PostDetailModal.module.scss';

const PostDetailModal = ({ id, onClose }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>
                <div className={styles.scrollableArea}>
                    <PostContent id={id} mode="modal" />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PostDetailModal;