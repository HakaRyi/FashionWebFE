import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Profile.module.scss';

const GalleryGrid = ({ posts = [] }) => {
    if (posts.length === 0) {
        return <div className={styles.emptyGallery}>No posts yet.</div>;
    }

    return (
        <motion.div layout className={styles.galleryGrid}>
            {posts.map((post, index) => (
                <motion.div 
                    key={index} 
                    whileHover={{ scale: 0.98 }} 
                    className={styles.galleryItem}
                >
                    <img src={post.imageUrl || post} alt={`Post ${index}`} />
                    <div className={styles.itemOverlay}>
                        <span>View Look</span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default GalleryGrid;