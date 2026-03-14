import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Share2, MapPin, Award, Plus, Grid, Bookmark, MessageSquare } from 'lucide-react';
import styles from './ExpertProfile.module.scss';

const ExpertProfile = () => {
    // Dữ liệu mẫu
    const expertData = {
        name: 'ALEXANDER VANG',
        role: 'Senior Stylist & Creative Director',
        location: 'Paris, France',
        bio: 'Định hình phong cách Minimalism và Old Money cho các nghệ sĩ hàng đầu. 10 năm kinh nghiệm trong ngành thời trang cao cấp.',
        followers: '12.5K',
        consultations: '1.2K',
        rating: '4.9',
        styles: ['Minimalism', 'Old Money', 'Avant-Garde'],
        posts: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500',
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500',
        ],
    };

    return (
        <div className={styles.profileContainer}>
            {/* HEADER: Thông tin cá nhân */}
            <header className={styles.header}>
                <div className={styles.avatarWrapper}>
                    <img src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=500" alt="Avatar" />
                    <div className={styles.onlineBadge} />
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.nameRow}>
                        <h1>{expertData.name}</h1>
                        <div className={styles.actions}>
                            <button className={styles.editBtn}>Edit Profile</button>
                            {/* <button className={styles.iconBtn}><Settings size={20} /></button> */}
                            <button className={styles.iconBtn}>
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.statsRow}>
                        <div className={styles.stat}>
                            <strong>{expertData.followers}</strong> followers
                        </div>
                        <div className={styles.stat}>
                            <strong>{expertData.consultations}</strong> consultations
                        </div>
                        <div className={styles.stat}>
                            <strong>{expertData.rating}</strong> <Award size={14} className="inline mb-1" />
                        </div>
                    </div>

                    <div className={styles.bio}>
                        <p className={styles.role}>{expertData.role}</p>
                        <p className={styles.location}>
                            <MapPin size={14} /> {expertData.location}
                        </p>
                        <p className={styles.description}>{expertData.bio}</p>
                    </div>

                    <div className={styles.tags}>
                        {expertData.styles.map((s) => (
                            <span key={s}>#{s}</span>
                        ))}
                    </div>
                </div>
            </header>

            {/* QUICK ACTIONS */}
            <div className={styles.quickActions}>
                <button className={styles.primaryAction}>
                    <Plus size={18} /> CREATE POST
                </button>
                <button className={styles.secondaryAction}>
                    <MessageSquare size={18} /> MESSAGES
                </button>
            </div>

            {/* TABS SELECTOR */}
            <div className={styles.tabs}>
                <div className={`${styles.tab} ${styles.active}`}>
                    <Grid size={18} /> LOOKBOOK
                </div>
                <div className={styles.tab}>
                    <Bookmark size={18} /> SAVED
                </div>
            </div>

            {/* GRID: Portfolio / Posts */}
            <motion.div layout className={styles.galleryGrid}>
                {expertData.posts.map((post, index) => (
                    <motion.div key={index} whileHover={{ scale: 0.98 }} className={styles.galleryItem}>
                        <img src={post} alt={`Post ${index}`} />
                        <div className={styles.itemOverlay}>
                            <span>View Look</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default ExpertProfile;
