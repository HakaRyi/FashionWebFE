import React from 'react';
import styles from './DefaultLayout.module.scss';

import { FaChartPie, FaUsers, FaUserTie, FaNewspaper, FaShirt } from 'react-icons/fa6';

function DefaultLayout({ children }) {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    Fashion<span>Admin</span>
                </div>
                <ul className={styles.navMenu}>
                    <li className={`${styles.navItem} ${styles.active}`}>
                        <FaChartPie /> <span>Dashboard</span>
                    </li>
                    <li className={styles.navItem}>
                        <FaUsers /> <span>Quản lý Users</span>
                    </li>
                    <li className={styles.navItem}>
                        <FaUserTie /> <span>Quản lý Experts</span>
                    </li>
                    <li className={styles.navItem}>
                        <FaNewspaper /> <span>Bài viết</span>
                    </li>
                    <li className={styles.navItem}>
                        <FaShirt /> <span>Sản phẩm</span>
                    </li>
                </ul>
            </aside>
            <main className={styles.content}>{children}</main>
        </div>
    );
}

export default DefaultLayout;
