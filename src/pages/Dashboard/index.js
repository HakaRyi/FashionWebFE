import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.scss';
import { FaUsers, FaUserTie, FaNewspaper, FaShirt, FaCoins, FaCrown } from 'react-icons/fa6';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // State cho Chart
    const [activeTab, setActiveTab] = useState('users');
    const [timeRange, setTimeRange] = useState('week');
    const [chartData, setChartData] = useState([]);

    const [revenueMonth, setRevenueMonth] = useState('2026-02');

    const [coinPackages] = useState([
        { id: 1, name: 'Gói Cơ Bản', price: '50k', sales: 120, total: 200, color: '#3b82f6' },
        { id: 2, name: 'Gói Nâng Cao', price: '200k', sales: 85, total: 200, color: '#10b981' },
        { id: 3, name: 'Gói VIP', price: '500k', sales: 45, total: 200, color: '#f59e0b' },
        { id: 4, name: 'Gói Kim Cương', price: '1tr', sales: 20, total: 200, color: '#8b5cf6' },
    ]);

    const [transactions] = useState([
        { id: 101, user: 'Nguyễn Văn A', pkgId: 3, date: '02/02/2026', amount: '500.000đ' },
        { id: 102, user: 'Trần Thị B', pkgId: 1, date: '02/02/2026', amount: '50.000đ' },
        { id: 103, user: 'Phạm Minh C', pkgId: 2, date: '01/02/2026', amount: '200.000đ' },
        { id: 104, user: 'Lê Hoàng D', pkgId: 1, date: '01/02/2026', amount: '50.000đ' },
        { id: 105, user: 'Hoàng Thùy E', pkgId: 4, date: '31/01/2026', amount: '1.000.000đ' },
    ]);

    const getPackageInfo = (id) => {
        return coinPackages.find((p) => p.id === id) || coinPackages[0];
    };

    const [stats] = useState([
        {
            id: 1,
            title: 'Tổng Người Dùng',
            value: '12,543',
            type: 'users',
            icon: <FaUsers />,
            trend: '+12%',
            isUp: true,
            color: '#4f46e5',
        },
        {
            id: 2,
            title: 'Tổng Chuyên Gia',
            value: '85',
            type: 'experts',
            icon: <FaUserTie />,
            trend: '+4%',
            isUp: true,
            color: '#10b981',
        },
        {
            id: 3,
            title: 'Tổng Bài Viết',
            value: '3,420',
            type: 'posts',
            icon: <FaNewspaper />,
            trend: '+24%',
            isUp: true,
            color: '#f59e0b',
        },
        {
            id: 4,
            title: 'Tổng Món Đồ',
            value: '45,210',
            type: 'items',
            icon: <FaShirt />,
            trend: '-2%',
            isUp: false,
            color: '#ef4444',
        },
    ]);

    const [recentUsers] = useState([
        { id: 1, name: 'Nguyễn Văn A', role: 'User', status: 'Active', date: '01/02/2026' },
        { id: 2, name: 'Trần Thị B', role: 'Expert', status: 'Active', date: '01/02/2026' },
        { id: 3, name: 'Lê Hoàng C', role: 'User', status: 'Pending', date: '31/01/2026' },
        { id: 4, name: 'Phạm Minh D', role: 'User', status: 'Active', date: '30/01/2026' },
    ]);

    // Hàm giả lập dữ liệu chart
    useEffect(() => {
        const generateData = () => {
            let days = 7;
            if (timeRange === 'month') {
                days = 30;
            } else if (timeRange === 'custom') {
                if (!startDate || !endDate) return;

                const start = new Date(startDate);
                const end = new Date(endDate);

                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 0 && end > start) {
                    days = diffDays + 1;
                }
            }

            const data = [];
            const baseValue =
                activeTab === 'users' ? 1000 : activeTab === 'experts' ? 50 : activeTab === 'posts' ? 300 : 4000;

            for (let i = 1; i <= days; i++) {
                let label = `Ngày ${i}`;
                if (timeRange === 'custom' && startDate) {
                    const d = new Date(startDate);
                    d.setDate(d.getDate() + i - 1);
                    label = `${d.getDate()}/${d.getMonth() + 1}`;
                }

                data.push({
                    name: label,
                    value: Math.floor(baseValue + Math.random() * (baseValue / 2)),
                });
            }
            setChartData(data);
        };

        generateData();
    }, [activeTab, timeRange, startDate, endDate]);

    // Lấy màu sắc dựa trên tab đang chọn
    const getCurrentColor = () => {
        const stat = stats.find((s) => s.type === activeTab);
        return stat ? stat.color : '#4f46e5';
    };

    const calculateTotalRevenue = () => {
        return transactions.reduce((total, trans) => {
            // 1. Xóa dấu chấm và chữ 'đ' để lấy số nguyên (VD: "500.000đ" -> 500000)
            const numericValue = parseInt(trans.amount.replace(/\./g, '').replace('đ', ''));
            return total + numericValue;
        }, 0);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Tổng Quan</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Chào mừng trở lại, Admin!</p>
                </div>
                <div className={styles.userProfile}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold' }}>Admin User</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Super Admin</div>
                    </div>
                    <div className={styles.avatar}>A</div>
                </div>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className={`${styles.statCard} ${styles[stat.type]}`}
                        onClick={() => setActiveTab(stat.type)} // Click vào card cũng chuyển tab chart
                        style={{
                            cursor: 'pointer',
                            border: activeTab === stat.type ? `2px solid ${stat.color}` : 'none',
                        }}
                    >
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>{stat.title}</span>
                            <div className={styles.statIcon}>{stat.icon}</div>
                        </div>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statTrend}>
                            <span className={stat.isUp ? styles.trendUp : styles.trendDown}>
                                {stat.isUp ? '↑' : '↓'} {stat.trend}
                            </span>
                            <span style={{ color: '#9ca3af' }}> so với tháng trước</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* PHẦN BIỂU ĐỒ MỚI THÊM */}
            <div className={styles.chartSection}>
                <div className={styles.chartHeader}>
                    <div className={styles.tabGroup}>
                        {stats.map((stat) => (
                            <button
                                key={stat.type}
                                className={`${styles.tabButton} ${activeTab === stat.type ? `${styles.tabActive} ${styles[stat.type]}` : ''}`}
                                onClick={() => setActiveTab(stat.type)}
                            >
                                {stat.title.replace('Tổng ', '')}
                            </button>
                        ))}
                    </div>

                    <div className={styles.filterGroup}>
                        <select
                            className={styles.filterSelect}
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="week">7 ngày qua</option>
                            <option value="month">Tháng này</option>
                            <option value="custom">Tùy chọn</option>
                        </select>

                        {timeRange === 'custom' && (
                            <>
                                <input
                                    type="date"
                                    className={styles.dateInput}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <span style={{ color: '#9ca3af' }}>-</span>
                                <input
                                    type="date"
                                    className={styles.dateInput}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={getCurrentColor()} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={getCurrentColor()} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={getCurrentColor()}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.coinSection}>
                {/* 1. Ô TRÁI: THỐNG KÊ GÓI BÁN CHẠY */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCrown style={{ color: '#f59e0b' }} /> Top Gói Coin
                        </h3>
                    </div>
                    <div className={styles.packageList}>
                        {coinPackages.map((pkg) => (
                            <div key={pkg.id} className={styles.packageItem}>
                                <div className={styles.packageInfo}>
                                    <span style={{ color: pkg.color, fontWeight: 'bold' }}>{pkg.name}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{pkg.sales} lượt mua</span>
                                </div>
                                {/* Thanh Progress Bar */}
                                <div className={styles.progressBarBg}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{
                                            width: `${(pkg.sales / 150) * 100}%`, // Giả sử max là 150 để tính %
                                            backgroundColor: pkg.color,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Ô PHẢI: DOANH THU THEO THÁNG (RỘNG HƠN) */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCoins style={{ color: '#3b82f6' }} /> Doanh Thu Bán Coin
                        </h3>
                        {/* Input chọn tháng năm */}
                        <input
                            type="month"
                            className={styles.dateInput}
                            value={revenueMonth}
                            onChange={(e) => setRevenueMonth(e.target.value)}
                        />
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Khách hàng</th>
                                    <th>Gói đã mua</th>
                                    <th>Ngày mua</th>
                                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((trans) => {
                                    const pkg = getPackageInfo(trans.pkgId);
                                    return (
                                        <tr key={trans.id}>
                                            <td style={{ fontWeight: 500 }}>{trans.user}</td>
                                            <td>
                                                <span
                                                    className={styles.packageBadge}
                                                    style={{ backgroundColor: pkg.color }}
                                                >
                                                    {pkg.name}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-muted)' }}>{trans.date}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{trans.amount}</td>
                                        </tr>
                                    );
                                })}
                                {/* Giả lập thêm dữ liệu để test scroll */}
                                {transactions.map((trans) => {
                                    const pkg = getPackageInfo(trans.pkgId);
                                    return (
                                        <tr key={`clone-${trans.id}`}>
                                            <td style={{ fontWeight: 500 }}>{trans.user} (Clone)</td>
                                            <td>
                                                <span
                                                    className={styles.packageBadge}
                                                    style={{ backgroundColor: pkg.color }}
                                                >
                                                    {pkg.name}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-muted)' }}>{trans.date}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{trans.amount}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.panelFooter}>
                        <span className={styles.footerLabel}>Tổng doanh thu tháng:</span>
                        <span className={styles.footerValue}>{formatCurrency(calculateTotalRevenue())}</span>
                    </div>
                </div>
            </div>

            <div className={styles.sectionGrid}>
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Người dùng mới tham gia</h3>
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                color: 'var(--primary-color)',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            Xem tất cả
                        </button>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Vai trò</th>
                                <th>Ngày tham gia</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <b>{user.name}</b>
                                    </td>
                                    <td>{user.role}</td>
                                    <td>{user.date}</td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${user.status === 'Active' ? styles.statusActive : styles.statusPending}`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Hoạt động gần đây</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <div
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--secondary-color)',
                                    }}
                                ></div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <b>User #{1000 + i}</b> vừa đăng tải một món đồ mới.
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 phút trước</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
