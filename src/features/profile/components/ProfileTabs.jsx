import React from 'react';
import { Grid, Bookmark, Briefcase, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../styles/ProfileTabs.module.scss';

const ProfileTabs = ({ isExpert, activeTab, onChange }) => {
    
    const tabs = [
        { id: 'lookbook', label: 'LOOKBOOK', icon: <Grid size={16} /> },
        { id: 'saved', label: 'SAVED', icon: <Bookmark size={16} /> },
    ];

    // if (isExpert) {
    //     tabs.push(
    //         { id: 'portfolio', label: 'PORTFOLIO', icon: <Briefcase size={16} /> },
    //         { id: 'awards', label: 'AWARDS', icon: <Award size={16} /> }
    //     );
    // }

    return (
        <nav className={styles.tabsContainer}>
            <div className={styles.tabsList}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
                            onClick={() => onChange(tab.id)}
                        >
                            <span className={styles.icon}>{tab.icon}</span>
                            <span className={styles.label}>{tab.label}</span>
                            
                            {/* Thanh gạch chân di chuyển mượt mà bằng Framer Motion */}
                            {isActive && (
                                <motion.div 
                                    layoutId="activeTabUnderline"
                                    className={styles.activeLine}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default ProfileTabs;