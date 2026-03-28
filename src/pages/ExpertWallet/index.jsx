import React from "react";
import { 
    WalletHeader, 
    WalletStats, 
    WalletTransactionTable, 
    useWallet 
} from "@/features/wallet";
import styles from "@/features/wallet/styles/ExpertWallet.module.scss";

const ExpertWalletPage = () => {
  // Khởi tạo hook với 5 items mỗi trang
  const { 
      stats, 
      transactions, 
      allData, // Dữ liệu đã lọc đầy đủ để Export CSV
      filter, 
      setFilter, 
      currentPage, 
      totalPages, 
      setCurrentPage,
      loading,
      error,
      refreshData 
  } = useWallet(5); 

  // 1. Trạng thái Loading
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Đang tải dữ liệu ví...</p>
      </div>
    );
  }

  // 2. Trạng thái Lỗi
  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>Không thể tải dữ liệu: {error.message}</p>
        <button onClick={refreshData} className={styles.btnRetry}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className={styles.walletContainer}>
      {/* Header: Truyền callback để refetch data sau khi nạp tiền thành công */}
      <WalletHeader onDepositSuccess={refreshData} />

      {/* Stats: Hiển thị 3 thẻ số dư */}
      <WalletStats stats={stats} />

      {/* Table Section: Chứa bảng và phân trang */}
      <div className={styles.tableSection}>
        <WalletTransactionTable
          transactions={transactions}
          allData={allData} // Dùng cho Export CSV
          filter={filter}
          setFilter={setFilter}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        
        {/* Empty State: Chỉ hiện khi trang hiện tại không có data */}
        {transactions.length === 0 && (
          <div className={styles.emptyState}>
            <p>Không tìm thấy lịch sử giao dịch nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertWalletPage;

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//     Wallet,
//     ArrowUpRight,
//     ArrowDownLeft,
//     History,
//     Plus,
//     Filter,
//     Download,
//     Coins
// } from 'lucide-react';
// import styles from './ExpertWallet.module.scss';

// const ExpertWallet = () => {
//     const [filter, setFilter] = useState('all');

//     const transactions = [
//         { id: '#TX1024', type: 'deposit', amount: 5000, date: '2024-03-08', status: 'Completed', detail: 'Nạp tiền qua VNPay' },
//         { id: '#TX1025', type: 'expense', amount: 1500, date: '2024-03-05', status: 'Completed', detail: 'Trả thưởng: Spring Fashion Event' },
//         { id: '#TX1026', type: 'expense', amount: 300, date: '2024-03-02', status: 'Pending', detail: 'Phí tổ chức Workshop' },
//         { id: '#TX1027', type: 'deposit', amount: 2000, date: '2024-02-28', status: 'Completed', detail: 'Nạp tiền qua Thẻ tín dụng' },
//     ];

//     const stats = [
//         { label: 'Số dư hiện tại', value: '12,500', icon: <Wallet color="#1a1a1a" />, sub: 'Coins khả dụng' },
//         { label: 'Tổng nạp', value: '45,000', icon: <ArrowUpRight color="#1fb163" />, sub: 'Tích lũy' },
//         { label: 'Đã chi thưởng', value: '32,500', icon: <ArrowDownLeft color="#eb5757" />, sub: 'Tổng 12 sự kiện' },
//     ];

//     return (
//         <div className={styles.walletContainer}>
//             <header className={styles.header}>
//                 <div className={styles.title}>
//                     <h1>My Wallet</h1>
//                     <p>Quản lý ngân sách và lịch sử dòng tiền của bạn.</p>
//                 </div>
//                 <button className={styles.btnDeposit}>
//                     <Plus size={18} /> Nạp thêm Coin
//                 </button>
//             </header>

//             {/* TOP STATS */}
//             <div className={styles.statsGrid}>
//                 {stats.map((item, idx) => (
//                     <motion.div
//                         key={idx}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: idx * 0.1 }}
//                         className={styles.statCard}
//                     >
//                         <div className={styles.cardHeader}>
//                             <div className={styles.iconBox}>{item.icon}</div>
//                             <span className={styles.subText}>{item.sub}</span>
//                         </div>
//                         <div className={styles.cardBody}>
//                             <h3>{item.value} <span>Coins</span></h3>
//                             <p>{item.label}</p>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>

//             {/* TRANSACTION HISTORY */}
//             <div className={styles.historySection}>
//                 <div className={styles.historyHeader}>
//                     <div className={styles.left}>
//                         <History size={20} />
//                         <h3>Lịch sử giao dịch</h3>
//                     </div>
//                     <div className={styles.actions}>
//                         <div className={styles.filterGroup}>
//                             <Filter size={14} />
//                             <select onChange={(e) => setFilter(e.target.value)}>
//                                 <option value="all">Tất cả</option>
//                                 <option value="deposit">Nạp tiền</option>
//                                 <option value="expense">Chi trả</option>
//                             </select>
//                         </div>
//                         <button className={styles.btnExport}><Download size={14} /> Xuất CSV</button>
//                     </div>
//                 </div>

//                 <div className={styles.tableWrapper}>
//                     <table className={styles.transactionTable}>
//                         <thead>
//                             <tr>
//                                 <th>Mã GD</th>
//                                 <th>Chi tiết</th>
//                                 <th>Ngày</th>
//                                 <th>Số lượng</th>
//                                 <th>Trạng thái</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {transactions.map((tx) => (
//                                 <tr key={tx.id}>
//                                     <td className={styles.idCol}>{tx.id}</td>
//                                     <td className={styles.detailCol}>{tx.detail}</td>
//                                     <td>{tx.date}</td>
//                                     <td className={tx.type === 'deposit' ? styles.plus : styles.minus}>
//                                         {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()}
//                                     </td>
//                                     <td>
//                                         <span className={`${styles.statusBadge} ${styles[tx.status.toLowerCase()]}`}>
//                                             {tx.status}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ExpertWallet;