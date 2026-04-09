import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Bell,
    Home,
    Settings,
    LogOut,
    ShieldCheck,
    ChevronDown,
    HelpCircle,
    CircleUserRound,
} from 'lucide-react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { PATHS } from '../../app/routes/paths';
import { useAuth } from '../../app/providers/AuthProvider';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Logic xử lý dữ liệu User
    const isLoggedIn = !!user;
    const isExpert = user?.role === 'expert';

    const displayUserName = user?.username || user?.userName || 'User';
    const avatarUrl = user?.avatars?.[0]?.url ||
        user?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserName)}&background=random&color=fff`;

    // 2. Điều hướng & Event
    const handleNavigation = (path) => {
        navigate(path);
        setShowProfileMenu(false);
    };

    const handleHomeClick = (e) => {
        if (location.pathname === PATHS.USER_FEED) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.dispatchEvent(new CustomEvent('reloadFeed'));
        }
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

    // 3. Effects (Click outside & Scroll)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${isLoggedIn ? styles.authMode : ''}`}>
            <div className={styles.navContainer}>
                {/* Logo */}
                <div className={styles.logoSection} onClick={handleLogoClick}>
                    <div className={styles.logo}>
                        WAPO<span></span>
                    </div>
                </div>

                {/* Central Island (Chỉ hiện khi login) */}
                {isLoggedIn && (
                    <div className={styles.centralIsland}>
                        <NavLink
                            to={PATHS.USER_FEED}
                            onClick={handleHomeClick}
                            className={({ isActive }) =>
                                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                            }
                        >
                            <Home size={20} />
                            <span className={styles.indicator}></span>
                        </NavLink>

                        <div className={styles.searchBox}>
                            <Search className={styles.searchIcon} size={16} />
                            <input type="text" placeholder="Search trends..." />
                        </div>
                    </div>
                )}

                {/* Right Section */}
                <div className={styles.rightSection}>
                    {isLoggedIn ? (
                        <div className={styles.userControls}>
                            <div className={styles.notifBadge}>
                                <button className={styles.iconButton}>
                                    <Bell size={22} />
                                </button>
                                <span className={styles.pulseDot}></span>
                            </div>

                            {/* Profile Menu Area */}
                            <div className={styles.profileArea} ref={menuRef}>
                                <button
                                    className={`${styles.profileTrigger} ${showProfileMenu ? styles.activeTrigger : ''}`}
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                    <div className={styles.avatarFrame}>
                                        <img
                                            src={avatarUrl}
                                            alt={displayUserName}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${displayUserName}&background=333&color=fff`;
                                            }}
                                        />
                                    </div>
                                    <ChevronDown size={14} className={styles.chevron} />
                                </button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className={styles.dropdown}
                                        >
                                            <div className={styles.dropdownHeader}>
                                                <p className={styles.userName}>{displayUserName}</p>
                                                <p className={styles.userHandle}>{user?.email}</p>
                                            </div>

                                            <div className={styles.dropdownDivider} />

                                            <button
                                                className={styles.dropdownItem}
                                                onClick={() => handleNavigation(PATHS.EXPERT_PROFILE.replace(':id', user?.id))}
                                            >
                                                <CircleUserRound size={18} /> <span>Profile</span>
                                            </button>

                                            {/* <button className={styles.dropdownItem}>
                                                <Settings size={18} /> <span>Settings</span>
                                            </button> */}

                                            <button
                                                className={styles.dropdownItem}
                                                onClick={() => handleNavigation(isExpert ? PATHS.EXPERT_EVENTS : PATHS.EXPERT_APPLICATION)}
                                            >
                                                <ShieldCheck size={18} />
                                                <span>{isExpert ? 'Expert Panel' : 'Become an Expert'}</span>
                                            </button>

                                            <button className={styles.dropdownItem} onClick={() => handleNavigation(PATHS.USER_POLICY)}>
                                                <HelpCircle size={18} /> <span>Policy</span>
                                            </button>

                                            <div className={styles.dropdownDivider} />

                                            <button
                                                className={`${styles.dropdownItem} ${styles.logout}`}
                                                onClick={() => {
                                                    logout();
                                                    navigate(PATHS.HOME);
                                                }}
                                            >
                                                <LogOut size={18} /> <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.guestButtons}>
                            <button
                                className={styles.btnPrimary}
                                onClick={() => navigate(PATHS.LOGIN)}
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;