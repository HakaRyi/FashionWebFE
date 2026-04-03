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