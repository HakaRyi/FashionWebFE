import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Bell, Home, LogOut, ShieldCheck,
    ChevronDown, HelpCircle, CircleUserRound, Info, PlusSquare
} from 'lucide-react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';

import styles from './Navbar.module.scss';
import { PATHS } from '../../app/routes/paths';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { useNavbarLogic } from '@/shared/hooks/useNavbarLogic';
import { getNotificationLink } from '@/shared/utils/notificationRouter';
import { CreatePostModal } from '@/features/feed';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 1. Hooks logic riêng biệt
    const {
        isScrolled, showProfileMenu, setShowProfileMenu,
        showNotifMenu, setShowNotifMenu, menuRef, notifRef
    } = useNavbarLogic();

    const {
        notifications,
        hasUnread,
        markAsRead,
        markAllAsRead
    } = useNotifications(!!user);

    // 2. Computed Variables
    const isLoggedIn = !!user;
    const isExpert = user?.role === 'expert';
    const displayUserName = user?.username || user?.userName || 'User';
    const avatarUrl = user?.avatars?.[0]?.url || user?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserName)}&background=random&color=fff`;

    // 3. Handlers
    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handlePostSuccess = () => {
        if (location.pathname === PATHS.USER_FEED) {
            window.dispatchEvent(new CustomEvent('reloadFeed'));
        } else {
            navigate(PATHS.USER_FEED);
        }
    };

    const handleNotificationClick = (notification) => {
        const notifId = notification.id || notification.notificationId;
        if (!notifId) return;

        const link = getNotificationLink(notification);
        setShowNotifMenu(false);
        navigate(link);

        if (notification.status?.toLowerCase() === 'unread') {
            markAsRead(notifId);
        }
    };

    const handleMarkAll = (e) => {
        e.stopPropagation();
        markAllAsRead();
    };

    const handleNavigation = (path) => {
        navigate(path);
        setShowProfileMenu(false);
    };

    const handleLogoClick = () => {
        if (isLoggedIn) {
            if (location.pathname === PATHS.USER_FEED) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.dispatchEvent(new CustomEvent('reloadFeed'));
            } else {
                navigate(PATHS.USER_FEED);
            }
        } else {
            navigate(PATHS.HOME);
        }
    };

    // 4. Framer Motion Variants
    const dropdownVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.95 }
    };

    return (
        <>
            <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${isLoggedIn ? styles.authMode : ''}`}>
                <div className={styles.navContainer}>

                    {/* Logo */}
                    <div className={styles.logoSection} onClick={handleLogoClick}>
                        <div className={styles.logo}>WAPO<span></span></div>
                    </div>

                    {/* Central Island - Chỉ hiện khi Login */}
                    {isLoggedIn && (
                        <div className={styles.centralIsland}>
                            <div
                                className={`${styles.navItem} ${location.pathname === PATHS.USER_FEED ? styles.active : ''}`}
                                onClick={handleLogoClick}
                                style={{ cursor: 'pointer' }}
                            >
                                <Home size={20} />
                                <span className={styles.indicator}></span>
                            </div>
                            <div className={styles.searchBox}>
                                <Search className={styles.searchIcon} size={16} />
                                <input
                                    type="text"
                                    placeholder="Search trends..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchSubmit}
                                />
                            </div>
                            <button
                                className={styles.createButton}
                                onClick={() => setIsCreateModalOpen(true)}
                                title="Create new post"
                            >
                                <PlusSquare size={20} />
                            </button>
                        </div>
                    )}

                    {/* Right Section */}
                    <div className={styles.rightSection}>
                        {isLoggedIn ? (
                            <div className={styles.userControls}>

                                {/* Notifications Area */}
                                <div className={styles.notifArea} ref={notifRef}>
                                    <div className={styles.notifBadge}>
                                        <button
                                            className={`${styles.iconButton} ${showNotifMenu ? styles.activeIcon : ''}`}
                                            onClick={() => setShowNotifMenu(!showNotifMenu)}
                                        >
                                            <Bell size={22} />
                                        </button>
                                        {hasUnread && <span className={styles.pulseDot}></span>}
                                    </div>

                                    <AnimatePresence>
                                        {showNotifMenu && (
                                            <motion.div
                                                variants={dropdownVariants}
                                                initial="hidden" animate="visible" exit="exit"
                                                className={styles.notifDropdown}
                                            >
                                                <div className={styles.notifHeader}>
                                                    <h3>Notifications</h3>
                                                    {hasUnread && (
                                                        <button className={styles.markAllBtn} onClick={handleMarkAll}>
                                                            Mark all as read
                                                        </button>
                                                    )}
                                                </div>
                                                <div className={styles.notifList}>
                                                    {notifications.length > 0 ? (
                                                        Array.from(new Map(notifications.map(item => [item.id, item])).values()).map((n) => (
                                                            <div
                                                                key={`notif-${n.id || index}`}
                                                                className={`${styles.notifItem} ${n.status?.toLowerCase() === 'unread' ? styles.unread : ''}`}
                                                                onClick={() => handleNotificationClick(n)}
                                                            >
                                                                <div className={styles.notifIcon}><Info size={16} /></div>
                                                                <div className={styles.notifContent}>
                                                                    <p className={styles.notifTitle}>{n.title}</p>
                                                                    <p className={styles.notifText}>{n.content}</p>
                                                                </div>
                                                                {n.status?.toLowerCase() === 'unread' && (
                                                                    <span className={styles.unreadDot} />
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className={styles.emptyNotif}>No notifications yet</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Profile Menu */}
                                <div className={styles.profileArea} ref={menuRef}>
                                    <button
                                        className={`${styles.profileTrigger} ${showProfileMenu ? styles.activeTrigger : ''}`}
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    >
                                        <div className={styles.avatarFrame}>
                                            <img src={avatarUrl} alt={displayUserName} />
                                        </div>
                                        <ChevronDown size={14} className={styles.chevron} />
                                    </button>

                                    <AnimatePresence>
                                        {showProfileMenu && (
                                            <motion.div
                                                variants={dropdownVariants}
                                                initial="hidden" animate="visible" exit="exit"
                                                className={styles.dropdown}
                                            >
                                                <div className={styles.dropdownHeader}>
                                                    <p className={styles.userName}>{displayUserName}</p>
                                                    <p className={styles.userHandle}>{user?.email}</p>
                                                </div>
                                                <div className={styles.dropdownDivider} />

                                                <button className={styles.dropdownItem} onClick={() => handleNavigation(PATHS.EXPERT_PROFILE.replace(':id', user?.id))}>
                                                    <CircleUserRound size={18} /> <span>Profile</span>
                                                </button>

                                                <button className={styles.dropdownItem} onClick={() => handleNavigation(isExpert ? PATHS.EXPERT_EVENTS : PATHS.EXPERT_APPLICATION)}>
                                                    <ShieldCheck size={18} /> <span>{isExpert ? 'Expert Panel' : 'Become an Expert'}</span>
                                                </button>

                                                <button className={styles.dropdownItem} onClick={() => handleNavigation(PATHS.USER_POLICY)}>
                                                    <HelpCircle size={18} /> <span>Policy</span>
                                                </button>

                                                <div className={styles.dropdownDivider} />

                                                <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={() => { logout(); navigate(PATHS.HOME); }}>
                                                    <LogOut size={18} /> <span>Sign Out</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.guestButtons}>
                                <button className={styles.btnPrimary} onClick={() => navigate(PATHS.LOGIN)}>Login</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handlePostSuccess}
                user={user}
            />
        </>
    );
};

export default Navbar;