import React from "react";
import { Trophy, Medal, Crown } from "lucide-react";
import styles from "../styles/PrizeSection.module.scss";

const PrizeSection = ({ prizes }) => {
    // Hàm lấy Icon và Style dựa trên thứ hạng
    const getPrizeStyle = (rank) => {
        switch (rank) {
            case 1: return { icon: <Crown size={24} />, class: styles.rank1 };
            case 2: return { icon: <Medal size={24} />, class: styles.rank2 };
            case 3: return { icon: <Trophy size={24} />, class: styles.rank3 };
            default: return { icon: <Trophy size={24} />, class: styles.rankDefault };
        }
    };

    return (
        <div className={styles.prizeSection}>
            {/* <div className={styles.sectionHeader}>
                <Trophy className={styles.mainIcon} />
                <h3>Prize structure</h3>
            </div> */}

            <div className={styles.prizeGrid}>
                {prizes?.sort((a, b) => a.ranked - b.ranked).map((prize) => {
                    const styleInfo = getPrizeStyle(prize.ranked);
                    return (
                        <div key={prize.prizeEventId} className={`${styles.prizeCard} ${styleInfo.class}`}>
                            <div className={styles.prizeIconWrapper}>
                                {styleInfo.icon}
                            </div>
                            <div className={styles.prizeContent}>
                                <div className={styles.rankLabel}>Rank {prize.ranked}</div>
                                <div className={styles.amount}>
                                    {prize.rewardAmount.toLocaleString()} <span>VNĐ</span>
                                </div>
                            </div>
                            {/* Một đường line trang trí mờ phía dưới */}
                            <div className={styles.cardDecoration}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PrizeSection;