import React, { useState } from 'react';
import styles from './Transaction.module.scss';
import { 
    FaMagnifyingGlass, FaDownload, FaFilter, FaCircleCheck, 
    FaCircleXmark, FaClock, FaMoneyBillTransfer, FaCreditCard 
} from 'react-icons/fa6';

const initialTransactions = [
    { 
        id: 'TRX78901', 
        user: 'Nguyễn Văn A', 
        package: 'Gói VIP', 
        amount: 500000, 
        method: 'Momo', 
        date: '2026-02-03 10:15', 
        status: 'Success' 
    },
    { 
        id: 'TRX78902', 
        user: 'Trần Thị B', 
        package: 'Gói Cơ Bản', 
        amount: 50000, 
        method: 'Banking', 
        date: '2026-02-03 09:30', 
        status: 'Pending' 
    },
    { 
        id: 'TRX78903', 
        user: 'Lê Hoàng C', 
        package: 'Gói Kim Cương', 
        amount: 1000000, 
        method: 'VNPAY', 
        date: '2026-02-02 15:45', 
        status: 'Failed' 
    },
    { 
        id: 'TRX78904', 
        user: 'Phạm Minh D', 
        package: 'Gói Nâng Cao', 
        amount: 200000, 
        method: 'Momo', 
        date: '2026-02-02 08:20', 
        status: 'Success' 
    },
];

function TransactionManagement() {
    const [transactions] = useState(initialTransactions);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Success': return <FaCircleCheck className={styles.iconSuccess} />;
            case 'Pending': return <FaClock className={styles.iconPending} />;
            case 'Failed': return <FaCircleXmark className={styles.iconFailed} />;
            default: return null;
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2>Quản Lý Giao Dịch</h2>
                    <p>Theo dõi và đối soát dòng tiền nạp Coin của hệ thống</p>
                </div>
                <button className={styles.btnExport}>
                    <FaDownload /> Xuất báo cáo Excel
                </button>
            </div>

            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <span>Doanh thu hôm nay</span>
                    <h3>{formatCurrency(550000)}</h3>
                </div>
                <div className={styles.summaryCard}>
                    <span>Giao dịch thành công</span>
                    <h3>128</h3>
                </div>
                <div className={styles.summaryCard}>
                    <span>Tỷ lệ thanh toán</span>
                    <h3>94.2%</h3>
                </div>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <FaMagnifyingGlass />
                    <input type="text" placeholder="Tìm theo mã giao dịch, tên người dùng..." />
                </div>
                <div className={styles.filterActions}>
                    <button className={styles.btnFilter}><FaFilter /> Bộ lọc</button>
                    <select className={styles.selectStatus}>
                        <option value="">Tất cả trạng thái</option>
                        <option value="Success">Thành công</option>
                        <option value="Pending">Đang chờ</option>
                        <option value="Failed">Thất bại</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mã Giao Dịch</th>
                            <th>Khách Hàng</th>
                            <th>Gói Coin</th>
                            <th>Số Tiền</th>
                            <th>Phương Thức</th>
                            <th>Thời Gian</th>
                            <th>Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((trx) => (
                            <tr key={trx.id}>
                                <td className={styles.trxId}>{trx.id}</td>
                                <td className={styles.userName}>{trx.user}</td>
                                <td><span className={styles.packageTag}>{trx.package}</span></td>
                                <td className={styles.amount}>{formatCurrency(trx.amount)}</td>
                                <td>
                                    <div className={styles.method}>
                                        {trx.method === 'Momo' ? <FaMoneyBillTransfer /> : <FaCreditCard />}
                                        {trx.method}
                                    </div>
                                </td>
                                <td className={styles.date}>{trx.date}</td>
                                <td>
                                    <div className={`${styles.statusBadge} ${styles[trx.status.toLowerCase()]}`}>
                                        {getStatusIcon(trx.status)}
                                        {trx.status === 'Success' ? 'Thành công' : trx.status === 'Pending' ? 'Đang chờ' : 'Thất bại'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionManagement;