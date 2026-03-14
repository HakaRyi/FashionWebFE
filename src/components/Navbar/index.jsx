import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Bell,
    Plus,
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
import { PATHS } from '../../routes/paths';
import { useAuth } from '../../app/providers/AuthProvider';

const Navbar = () => {
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isExpert = user?.role === 'expert';

    const handleNavigation = (path) => {
        navigate(path);
        setShowProfileMenu(false);
    };

    const handleHomeClick = (e) => {
        if (location.pathname === PATHS.USER_FEED) {
            e.preventDefault();

            window.scrollTo({ top: 0, behavior: 'smooth' });

            const event = new CustomEvent('reloadFeed');
            window.dispatchEvent(event);
        }
    };

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
                {/* LEFT: LOGO */}
                <div className={styles.logoSection} onClick={() => navigate('/')}>
                    <div className={styles.logo}>
                        VOGUE<span></span>
                    </div>
                </div>

                {/* MIDDLE: MAIN ACTIONS (The "Island" Layout) */}
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

                        <button className={styles.createButton}>
                            <Plus size={18} strokeWidth={2.5} />
                            <span>Create</span>
                        </button>
                    </div>
                )}

                {/* RIGHT: UTILS & PROFILE */}
                <div className={styles.rightSection}>
                    {isLoggedIn ? (
                        <div className={styles.userControls}>
                            <div className={styles.notifBadge}>
                                <button className={styles.iconButton}>
                                    <Bell size={22} />
                                </button>
                                <span className={styles.pulseDot}></span>
                            </div>

                            <div className={styles.profileArea} ref={menuRef}>
                                <button
                                    className={`${styles.profileTrigger} ${showProfileMenu ? styles.activeTrigger : ''}`}
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                    <div className={styles.avatarFrame}>
                                        <img
                                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                                            alt="User"
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
                                                <p className={styles.userName}>{user?.userName}</p>
                                                <p className={styles.userHandle}>@alexvogue</p>
                                            </div>

                                            <div className={styles.dropdownDivider} />

                                            <button
                                                className={styles.dropdownItem}
                                                onClick={() => handleNavigation(PATHS.EXPERT_PROFILE)}
                                            >
                                                <CircleUserRound size={18} /> <span>Profile</span>
                                            </button>
                                            <button className={styles.dropdownItem}>
                                                <Settings size={18} /> <span>Settings</span>
                                            </button>
                                            <button
                                                className={styles.dropdownItem}
                                                onClick={() => {
                                                    if (isExpert) {
                                                        handleNavigation(PATHS.EXPERT_EVENTS);
                                                    } else {
                                                        handleNavigation(PATHS.EXPERT_APPLICATION);
                                                    }
                                                }}
                                            >
                                                <ShieldCheck size={18} /> <span>Expert Mode</span>
                                            </button>
                                            <button className={styles.dropdownItem}>
                                                <HelpCircle size={18} /> <span>Support</span>
                                            </button>

                                            <div className={styles.dropdownDivider} />

                                            <button className={`${styles.dropdownItem} ${styles.logout}`}
                                                onClick={() => {
                                                    logout();
                                                    navigate(PATHS.HOME);
                                                }}>
                                                <LogOut size={18} /> <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.guestButtons}>
                            <button className={styles.btnText}>Login</button>
                            <button className={styles.btnPrimary}>Join Vogue</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
