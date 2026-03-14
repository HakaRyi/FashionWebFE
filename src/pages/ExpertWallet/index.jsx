import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    Plus,
    Filter,
    Download,
    Coins
} from 'lucide-react';
import styles from './ExpertWallet.module.scss';

const ExpertWallet = () => {
    const [filter, setFilter] = useState('all');

    const transactions = [
        { id: '#TX1024', type: 'deposit', amount: 5000, date: '2024-03-08', status: 'Completed', detail: 'Nạp tiền qua VNPay' },
        { id: '#TX1025', type: 'expense', amount: 1500, date: '2024-03-05', status: 'Completed', detail: 'Trả thưởng: Spring Fashion Event' },
        { id: '#TX1026', type: 'expense', amount: 300, date: '2024-03-02', status: 'Pending', detail: 'Phí tổ chức Workshop' },
        { id: '#TX1027', type: 'deposit', amount: 2000, date: '2024-02-28', status: 'Completed', detail: 'Nạp tiền qua Thẻ tín dụng' },
    ];

    const stats = [
        { label: 'Số dư hiện tại', value: '12,500', icon: <Wallet color="#1a1a1a" />, sub: 'Coins khả dụng' },
        { label: 'Tổng nạp', value: '45,000', icon: <ArrowUpRight color="#1fb163" />, sub: 'Tích lũy' },
        { label: 'Đã chi thưởng', value: '32,500', icon: <ArrowDownLeft color="#eb5757" />, sub: 'Tổng 12 sự kiện' },
    ];

    return (
        <div className={styles.walletContainer}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h1>My Wallet</h1>
                    <p>Quản lý ngân sách và lịch sử dòng tiền của bạn.</p>
                </div>
                <button className={styles.btnDeposit}>
                    <Plus size={18} /> Nạp thêm Coin
                </button>
            </header>

            {/* TOP STATS */}
            <div className={styles.statsGrid}>
                {stats.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={styles.statCard}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.iconBox}>{item.icon}</div>
                            <span className={styles.subText}>{item.sub}</span>
                        </div>
                        <div className={styles.cardBody}>
                            <h3>{item.value} <span>Coins</span></h3>
                            <p>{item.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* TRANSACTION HISTORY */}
            <div className={styles.historySection}>
                <div className={styles.historyHeader}>
                    <div className={styles.left}>
                        <History size={20} />
                        <h3>Lịch sử giao dịch</h3>
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.filterGroup}>
                            <Filter size={14} />
                            <select onChange={(e) => setFilter(e.target.value)}>
                                <option value="all">Tất cả</option>
                                <option value="deposit">Nạp tiền</option>
                                <option value="expense">Chi trả</option>
                            </select>
                        </div>
                        <button className={styles.btnExport}><Download size={14} /> Xuất CSV</button>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.transactionTable}>
                        <thead>
                            <tr>
                                <th>Mã GD</th>
                                <th>Chi tiết</th>
                                <th>Ngày</th>
                                <th>Số lượng</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td className={styles.idCol}>{tx.id}</td>
                                    <td className={styles.detailCol}>{tx.detail}</td>
                                    <td>{tx.date}</td>
                                    <td className={tx.type === 'deposit' ? styles.plus : styles.minus}>
                                        {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()}
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[tx.status.toLowerCase()]}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpertWallet;