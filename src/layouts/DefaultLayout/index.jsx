import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './DefaultLayout.module.scss';
import { FaChartPie, FaUsers, FaUserTie, FaNewspaper, FaShirt,FaCoins, FaFlag,FaMoneyBill} from 'react-icons/fa6';
import { PATHS } from '../../routes/paths';

function DefaultLayout({ children }) {
    const menuItems = [
        { path: PATHS.DASHBOARD, icon: <FaChartPie />, label: 'Dashboard' },
        { path: PATHS.USERS, icon: <FaUsers />, label: 'Quản lý Users' },
        { path: PATHS.EXPERTS, icon: <FaUserTie />, label: 'Quản lý Experts' },
        { path: PATHS.POSTS, icon: <FaNewspaper />, label: 'Bài viết' },
        { path: PATHS.PRODUCTS, icon: <FaCoins />, label: 'Coin' },
        { path: PATHS.REPORTS, icon: <FaFlag />, label: 'Báo cáo vi phạm' },
        { path: PATHS.TRANSACTIONS, icon: <FaMoneyBill />, label: 'Giao dịch' },    
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    Fashion<span>Admin</span>
                </div>
                <nav className={styles.navMenu}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                `${styles.navItem} ${isActive ? styles.active : ''}`
                            }
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className={styles.content}>
                <div className={styles.innerContent}>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default DefaultLayout;