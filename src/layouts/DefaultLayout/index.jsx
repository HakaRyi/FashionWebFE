import React from 'react';
import { NavLink,useNavigate} from 'react-router-dom';
import styles from './DefaultLayout.module.scss';
import { 
    FaChartPie, FaUsers, FaUserTie, FaNewspaper, 
    FaCoins, FaFlag, FaMoneyBillTransfer, FaGear, FaStarAndCrescent,FaRightFromBracket
} from 'react-icons/fa6';

function DefaultLayout({ children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Xóa token
        navigate('/login');   // Chuyển hướng
    };
    const menuGroups = [
        {
            title: 'Tổng quan',
            items: [
                { path: '/dashboard', icon: <FaChartPie />, label: 'Bảng điều khiển' },
            ]
        },
        {
            title: 'Quản lý người dùng',
            items: [
                { path: '/users', icon: <FaUsers />, label: 'Thành viên' },
                { path: '/experts', icon: <FaUserTie />, label: 'Chuyên gia' },
            ]
        },
        {
            title: 'Nội dung & Cộng đồng',
            items: [
                { path: '/posts', icon: <FaNewspaper />, label: 'Bài viết Blog' },
                { path: '/reports', icon: <FaFlag />, label: 'Báo cáo vi phạm' },
            ]
        },
        {
            title: 'Sự kiện',
            items: [
                { path: '/admin-events', icon: <FaStarAndCrescent />, label: 'Quản lý sự kiện' },
            ]
        },
        {
            title: 'Tài chính & Gói cước',
            items: [
                { path: '/products', icon: <FaCoins />, label: 'Gói nạp Coin' },
                { path: '/transactions', icon: <FaMoneyBillTransfer />, label: 'Lịch sử giao dịch' },
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.logoBox}>F</div>
                    Fashion<span>Admin</span>
                </div>

                <nav className={styles.navMenu}>
                    {menuGroups.map((group, index) => (
                        <div key={index} className={styles.menuGroup}>
                            <h4 className={styles.groupTitle}>{group.title}</h4>
                            {group.items.map((item) => (
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
                        </div>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.adminProfile}>
                        <img src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff" alt="avatar" />
                        <div className={styles.adminInfo}>
                            <p>Quản trị viên</p>
                            <span>Trực tuyến</span>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <FaRightFromBracket className={styles.icon} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            <main className={styles.content}>
                <header className={styles.topHeader}>
                    {/* Bạn có thể thêm thanh tìm kiếm hoặc thông báo ở đây */}
                    <div className={styles.breadcrumb}>Hệ thống / Quản lý</div>
                </header>
                <div className={styles.innerContent}>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default DefaultLayout;