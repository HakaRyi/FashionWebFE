// components/ProfileLayout.jsx
import React from 'react';
import { CheckCircle, MapPin, Award } from 'lucide-react';
import styles from '../styles/Profile.module.scss';

const ProfileLayout = ({ account, expert, actions, children }) => {
    const isExpert = !!expert?.verified;

    return (
        <div className={styles.profileContainer}>
            <header className={styles.header}>
                <div className={`${styles.avatarWrapper} ${isExpert ? styles.isExpert : ''}`}>
                    <img src={account?.avatarUrl || '/default-avatar.png'} alt="Avatar" />
                    {isExpert && <CheckCircle className={styles.verifiedIcon} size={20} />}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.nameRow}>
                        <h1>{account?.fullName}</h1>
                        <div className={styles.actionButtons}>{actions}</div>
                    </div>

                    <div className={styles.statsRow}>
                        <span><strong>1.2K</strong> followers</span>
                        {isExpert && (
                            <>
                                <span><strong>{expert.ratingAvg}</strong> <Award size={14} /></span>
                                <span><strong>{expert.yearsOfExperience}+</strong> years exp</span>
                            </>
                        )}
                    </div>

                    <div className={styles.bio}>
                        {isExpert && <p className={styles.expertiseField}>{expert.expertiseField}</p>}
                        <p>{expert?.bio || account?.bio || "No bio yet."}</p>
                        <p className={styles.location}><MapPin size={14} /> {account?.location || 'Earth'}</p>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default ProfileLayout;