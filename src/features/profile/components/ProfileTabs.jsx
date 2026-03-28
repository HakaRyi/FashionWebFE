import React, { useState } from 'react';
import { Grid, Bookmark, Briefcase, Award } from 'lucide-react';
import styles from '../styles/Profile.module.scss';

const ProfileTabs = ({ isExpert }) => {
    const [activeTab, setActiveTab] = useState('lookbook');

    const tabs = [
        { id: 'lookbook', label: 'LOOKBOOK', icon: <Grid size={18} /> },
        { id: 'saved', label: 'SAVED', icon: <Bookmark size={18} /> },
    ];

    // Nếu là Expert thì thêm các tab đặc thù
    if (isExpert) {
        tabs.push(
            { id: 'portfolio', label: 'PORTFOLIO', icon: <Briefcase size={18} /> },
            { id: 'certificates', label: 'AWARDS', icon: <Award size={18} /> }
        );
    }

    return (
        <div className={styles.tabs}>
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.icon} {tab.label}
                </div>
            ))}
        </div>
    );
};

export default ProfileTabs;