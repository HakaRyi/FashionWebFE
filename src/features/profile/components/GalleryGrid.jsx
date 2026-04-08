import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import styles from '../styles/GalleryGrid.module.scss';

const GalleryGrid = ({ posts = [] }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className={styles.emptyGallery}>
                <p>No looks shared yet.</p>
            </div>
        );
    }

    // Animation variants cho container và item
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            className={styles.galleryGrid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {posts.map((post) => (
                <motion.div 
                    key={post.postId} 
                    className={styles.galleryItem}
                    variants={itemVariants}
                    whileHover={{ y: -5 }} // Nhích nhẹ lên khi hover
                >
                    <div className={styles.imageContainer}>
                        <img 
                            src={post.images?.[0] || 'https://via.placeholder.com/500'} 
                            alt={post.title} 
                            loading="lazy"
                        />
                        
                        <div className={styles.itemOverlay}>
                            <div className={styles.overlayContent}>
                                <div className={styles.stats}>
                                    <div className={styles.statItem}>
                                        <Heart size={20} fill="white" />
                                        <span>{post.likeCount || 0}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <MessageCircle size={20} fill="white" />
                                        <span>{post.commentCount || 0}</span>
                                    </div>
                                </div>
                                <p className={styles.postTitle}>{post.title}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default GalleryGrid;