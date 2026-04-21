import React from "react";
import { Plus } from "lucide-react";
import styles from "../styles/ExpertWallet.module.scss";

const WalletHeader = ({ onDepositClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>My Wallet</h1>
        <p>Manage your budget and transaction history.</p>
      </div>

      <button className={styles.btnDeposit} onClick={onDepositClick}>
        <Plus size={18} /> Add Money
      </button>
    </header>
  );
};

export default WalletHeader;