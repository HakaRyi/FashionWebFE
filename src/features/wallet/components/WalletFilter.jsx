import React from "react";
import { Filter } from "lucide-react";
import styles from "../styles/ExpertWallet.module.scss";

const WalletFilter = ({ filter, setFilter }) => {
  return (
    <div className={styles.filterGroup}>
      <Filter size={14} />
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All Transactions</option>
        <option value="deposit">Deposits</option>
        <option value="withdrawal">Withdrawals</option>
      </select>
    </div>
  );
};

export default WalletFilter;