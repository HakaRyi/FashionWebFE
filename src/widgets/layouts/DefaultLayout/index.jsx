import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './DefaultLayout.module.scss';

import {
    FaChartPie,
    FaUsers,
    FaUserTie,
    FaNewspaper,
    FaMoneyBillTransfer,
    FaCoins,
    FaFlag,
    FaMoneyBill,
    FaRightFromBracket,
    FaClock,
    FaGear,
    FaFileInvoiceDollar,
} from 'react-icons/fa6';
import { MdEventNote } from 'react-icons/md';
import { PATHS } from '@/app/routes/paths';
import { useAuth } from '@/app/providers/AuthProvider';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function DefaultLayout({ children }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: 'Log out?',
            text: 'Are you sure you want to leave the admin system?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            background: '#ffffff',
            borderRadius: '16px',
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                toast.success('Successfully logged out!');
                navigate(PATHS.HOME);
            }
        });
    };
    const menuGroups = [
        {
            title: 'Overview',
            items: [{ path: '/dashboard', icon: <FaChartPie />, label: 'Dashboard' }],
        },
        {
            title: 'User Management',
            items: [
                { path: '/users', icon: <FaUsers />, label: 'Members' },
                { path: '/experts', icon: <FaUserTie />, label: 'Experts' },
            ],
        },
        {
            title: 'Content and Community',
            items: [
                { path: PATHS.EVENTS, icon: <MdEventNote />, label: 'Event Management' },
                { path: '/posts', icon: <FaNewspaper />, label: 'Blog Posts' },
                { path: '/reports', icon: <FaFlag />, label: 'Violation Reports' },
            ],
        },
        {
            title: 'Finance & Packages',
            items: [
                // { path: '/products', icon: <FaCoins />, label: 'Gói nạp Coin' },
                { path: '/transactions', icon: <FaMoneyBillTransfer />, label: 'Transaction history' },
                { path: '/refunds', icon: <FaFileInvoiceDollar />, label: 'Refund requests' },
            ],
        },
        {
            title: 'System & Configuration',
            items: [
                { path: PATHS.QUARTZ, icon: <FaClock />, label: 'Quartz Manager' },
                { path: PATHS.SYSTEM, icon: <FaGear />, label: 'System configuration' },
            ],
        },
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.logoBox}></div>
                    WAPO<span>Admin</span>
                </div>

                <nav className={styles.navMenu}>
                    {menuGroups.map((group, index) => (
                        <div key={index} className={styles.menuGroup}>
                            <h4 className={styles.groupTitle}>{group.title}</h4>
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                                >
                                    <span className={styles.icon}>{item.icon}</span>
                                    <span className={styles.label}>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.adminProfile}>
                        <img src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff" alt="avatar" />
                        <div className={styles.adminInfo}>
                            <p>Administrator</p>
                            <span>Online</span>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <FaRightFromBracket className={styles.icon} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className={styles.content}>
                <header className={styles.topHeader}>
                    {/* Bạn có thể thêm thanh tìm kiếm hoặc thông báo ở đây */}
                    {/* <div className={styles.breadcrumb}>Hệ thống / Quản lý</div> */}
                </header>
                <div className={styles.innerContent}>{children}</div>
            </main>
        </div>
    );
}

export default DefaultLayout;
