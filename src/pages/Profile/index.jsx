import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    ProfileLayout,
    ProfileTabs,
    GalleryGrid,
    useProfile
} from '@/features/profile';
import { useAuth } from '@/app/providers/AuthProvider';
import { Settings, Edit2, UserPlus, MessageCircle } from 'lucide-react';
import styles from './Profile.module.scss';

const ProfilePage = () => {
    const { id: paramId } = useParams();
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('lookbook');

    const accountId = paramId || currentUser?.id;
    const { profile, posts, loading, error } = useProfile(accountId, currentUser?.id);

    const isOwnProfile = useMemo(() =>
        String(profile?.id) === String(currentUser?.id),
        [profile, currentUser]);

    if (loading) return <div className={styles.centered}>Loading Vogue Profile...</div>;
    if (error || !profile) return <div className={styles.centered}>User not found.</div>;

    const ActionButtons = (
        <div className={styles.actionGroup}>
            {isOwnProfile ? (
                <>
                    <button className={styles.primaryBtn}>
                        <Edit2 size={14} /> Edit Profile
                    </button>
                    <button className={styles.iconBtn}>
                        <Settings size={18} />
                    </button>
                </>
            ) : (
                <>
                    <button className={styles.followBtn}>
                        <UserPlus size={14} /> Follow
                    </button>
                    <button className={styles.secondaryBtn}>
                        <MessageCircle size={14} /> Message
                    </button>
                </>
            )}
        </div>
    );

    // Logic lọc dữ liệu dựa trên tab đang chọn
    const renderContent = () => {
        switch (activeTab) {
            case 'lookbook':
                return <GalleryGrid posts={posts} />;
            case 'saved':
                // Giả sử API trả về savedPosts trong object profile hoặc posts
                return <GalleryGrid posts={profile.savedPosts || []} />;
            case 'portfolio':
                return <div className={styles.placeholder}>Expert Portfolio Content...</div>;
            case 'awards':
                return <div className={styles.placeholder}>Certification & Awards...</div>;
            default:
                return <GalleryGrid posts={posts} />;
        }
    };

    return (
        <ProfileLayout
            profile={profile}
            actions={ActionButtons}
        >
            <ProfileTabs
                isExpert={profile.isExpert}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <section className={styles.tabContent}>
                {renderContent()}
            </section>
        </ProfileLayout>
    );
};

export default ProfilePage;