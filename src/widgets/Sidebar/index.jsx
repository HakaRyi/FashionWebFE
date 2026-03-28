import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    CalendarRange,
    UserCircle,
    BarChart3,
    Settings,
    MailCheck,
    PlusCircle,
    Wallet,
    ClipboardCheck,
} from 'lucide-react';
import styles from './ExpertSidebar.module.scss';
import { PATHS } from '../../app/routes/paths';

const menuItems = [
    // { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/expert/dashboard' },
    { icon: <CalendarRange size={20} />, label: 'My Events', path: PATHS.EXPERT_EVENTS },
    {
        icon: <MailCheck size={20} />,
        label: 'Invitations',
        path: PATHS.EXPERT_INVITATIONS
    },
    { icon: <ClipboardCheck size={20} />, label: 'Submissions Review', path: PATHS.EXPERT_SUBMISSION_REVIEW },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: PATHS.EXPERT_DASHBOARD },
    { icon: <Wallet size={20} />, label: 'Wallet', path: PATHS.EXPERT_WALLET },
    // { icon: <UserCircle size={20} />, label: 'Public Profile', path: PATHS.EXPERT_PROFILE },
    // { icon: <Settings size={20} />, label: 'Settings', path: '/expert/settings' },
];

const ExpertSidebar = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.sidebarInner}>
            <div className={styles.actionSection}>
                <button className={styles.btnCreate} onClick={() => navigate(PATHS.EXPERT_CREATE_EVENTS)}>
                    <PlusCircle size={20} />
                    <span>New Event</span>
                </button>
            </div>

            <nav className={styles.navMenu}>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                        }
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.label}>{item.label}</span>
                        <motion.div className={styles.indicator} layoutId="activeIndicator" />
                    </NavLink>
                ))}
            </nav>

            <div className={styles.footerInfo}>
                <div className={styles.statusCard}>
                    <p>Expert Status</p>
                    <span>Verified Professional</span>
                </div>
            </div>
        </div>
    );
};

export default ExpertSidebar;