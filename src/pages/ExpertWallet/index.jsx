import React, { useState } from "react";
import {
  WalletHeader,
  WalletStats,
  WalletTransactionTable,
  useWallet,
  DepositModal
} from "@/features/wallet";
import styles from "@/features/wallet/styles/ExpertWallet.module.scss";

const ExpertWalletPage = () => {

  const [showDepositModal, setShowDepositModal] = useState(false);

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
        <p>Loading wallet data...</p>
      </div>
    );
  }

  // 2. Trạng thái Lỗi
  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>Cannot load wallet data: {error.message}</p>
        <button onClick={refreshData} className={styles.btnRetry}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles.walletContainer}>
      <WalletHeader onDepositClick={() => setShowDepositModal(true)} />

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
            <p>No transaction history was found.</p>
          </div>
        )}
      </div>
      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
          onRefreshBalance={refreshData}
          amount={0}
          isFixedAmount={false}
        />
      )}
    </div>
  );
};

export default ExpertWalletPage;