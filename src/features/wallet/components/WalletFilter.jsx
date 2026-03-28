import React from "react";
import { Filter } from "lucide-react";
import styles from "../styles/ExpertWallet.module.scss";

const WalletFilter = ({ filter, setFilter }) => {
  return (
    <div className={styles.filterGroup}>
      <Filter size={14} />

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Tất cả</option>
        <option value="deposit">Nạp tiền</option>
        <option value="expense">Chi trả</option>
      </select>
    </div>
  );
};

export default WalletFilter;