import React from "react";
import { Plus } from "lucide-react";
import styles from "../styles/ExpertWallet.module.scss";

const WalletHeader = ({ onDepositClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>My Wallet</h1>
        <p>Quản lý ngân sách và lịch sử dòng tiền của bạn.</p>
      </div>

      <button className={styles.btnDeposit} onClick={onDepositClick}>
        <Plus size={18} /> Nạp thêm VND
      </button>
    </header>
  );
};

export default WalletHeader;