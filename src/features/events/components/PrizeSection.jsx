import React from "react";
import { Trophy } from "lucide-react";
import styles from "../styles/EventDetail.module.scss";

const PrizeSection = ({ prizes }) => (
    <div className={styles.card}>
        <h3><Trophy size={18} color="#d4af37" /> Cơ cấu giải thưởng</h3>
        <div className={styles.prizeGrid}>
            {prizes?.map((prize) => (
                <div key={prize.prizeEventId} className={styles.prizeCard}>
                    <div className={styles.prizeRank}>Hạng {prize.ranked}</div>
                    <div className={styles.prizeAmount}>{prize.rewardAmount.toLocaleString()} VNĐ</div>
                    <div className={styles.prizeStatus}>Trạng thái: {prize.status}</div>
                </div>
            ))}
        </div>
    </div>
);

export default PrizeSection;