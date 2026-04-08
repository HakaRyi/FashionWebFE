import React from 'react';
import { CheckCircle, Award, Star } from 'lucide-react';
import styles from '../styles/ProfileLayout.module.scss';

const ProfileLayout = ({ profile, actions, children }) => {
    // Fallback avatar if not provided
    const avatarUrl = profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}&background=random`;

    return (
        <div className={styles.profileContainer}>
            <header className={styles.header}>
                <div className={styles.avatarSection}>
                    <div className={`${styles.avatarWrapper} ${profile.verified ? styles.isExpert : ''}`}>
                        <img 
                            src={avatarUrl} 
                            alt={`${profile.username}'s avatar`} 
                            className={styles.avatarImage}
                        />
                        {profile.verified && (
                            <div className={styles.verifiedBadge}>
                                <CheckCircle size={22} fill="#1d9bf0" color="#fff" />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.nameRow}>
                        <div className={styles.titleGroup}>
                            <h1>{profile.username}</h1>
                            <span className={styles.roleBadge}>{profile.role}</span>
                        </div>
                        <div className={styles.actions}>{actions}</div>
                    </div>

                    <div className={styles.statsRow}>
                        <div className={styles.stat}>
                            <strong>{profile.followerCount || 0}</strong> <span>followers</span>
                        </div>
                        <div className={styles.stat}>
                            <strong>{profile.postCount || 0}</strong> <span>posts</span>
                        </div>
                        {profile.isExpert && (
                            <>
                                <div className={styles.stat}>
                                    <strong>{profile.rating || 0}</strong> 
                                    <Star size={14} fill="currentColor" className={styles.starIcon} />
                                </div>
                                <div className={styles.stat}>
                                    <strong>{profile.reputationScore || 0}</strong> <span>Rep</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles.bioSection}>
                        {profile.isExpert && (
                            <div className={styles.expertiseField}>
                                <Award size={16} /> 
                                <span>{profile.expertiseField} • {profile.yearsOfExperience} years exp</span>
                            </div>
                        )}
                        <p className={styles.bioText}>{profile.bio || "No bio yet."}</p>
                        <div className={styles.metaStatus}>
                            <span className={profile.isOnline === 'Online' ? styles.online : styles.offline}>
                                <span className={styles.statusDot}>●</span> {profile.isOnline}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <nav className={styles.profileNav}>
                {/* Phần này thường chứa Tabs từ children */}
                {children}
            </nav>
        </div>
    );
};

export default ProfileLayout;