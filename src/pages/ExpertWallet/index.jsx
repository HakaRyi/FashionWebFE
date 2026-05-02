import { useState } from "react";
import {
  WalletHeader,
  WalletStats,
  WalletTransactionTable,
  WalletCharts,
  useWallet,
  DepositModal
} from "@/features/wallet";
import styles from "@/features/wallet/styles/ExpertWallet.module.scss";

const ExpertWalletPage = () => {
  const [showDepositModal, setShowDepositModal] = useState(false);

  const {
    stats,
    transactions,
    chartData,
    pieData,
    allData,
    filter,
    setFilter,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    refreshData
  } = useWallet({ itemsPerPage: 5 });

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading wallet data...</p>
      </div>
    );
  }

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

      <WalletStats stats={stats} />

      <WalletCharts chartData={chartData} pieData={pieData} />

      {/* Table Section giờ đây cực kỳ gọn gàng */}
      <div className={styles.tableSection}>
        <WalletTransactionTable
          transactions={transactions}
          allData={allData}
          filter={filter}
          setFilter={setFilter}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
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