import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/ExpertWallet.module.scss";

const WalletStats = ({ stats }) => {
  return (
    <div className={styles.statsGrid}>
      {stats.map((item, idx) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={styles.statCard}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <Icon size={20} />
              </div>
              <span className={styles.subText}>{item.sub}</span>
            </div>

            <div className={styles.cardBody}>
              <h3>
                {item.value} <span>Coins</span>
              </h3>
              <p>{item.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WalletStats;