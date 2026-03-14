import React, { memo, useCallback } from "react";
import { Trophy, Coins, X, Plus } from "lucide-react";
import styles from "../styles/PrizeManager.module.scss";

const PrizeManager = ({ prizes, setPrizes, totalBudget, isOverBudget }) => {

  const updatePrize = useCallback((index, field, value) => {
    setPrizes(prev =>
      prev.map((prize, i) =>
        i === index ? { ...prize, [field]: field === "amount" ? Number(value) : value } : prize
      )
    );
  }, [setPrizes]);

  const addPrize = useCallback(() => {
    setPrizes(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: "Giải mới",
        amount: 0
      }
    ]);
  }, [setPrizes]);

  const removePrize = useCallback((index) => {
    setPrizes(prev => prev.filter((_, i) => i !== index));
  }, [setPrizes]);

  return (
    <div className={styles.configCard}>
      
      <div className={styles.cardHeader}>
        <Trophy size={18} />
        <h3>Cơ chế giải thưởng</h3>

        <div
          className={`${styles.totalBadge} ${
            isOverBudget ? styles.err : ""
          }`}
        >
          Tổng: {totalBudget.toLocaleString()}
        </div>
      </div>

      <div className={styles.prizeScroll}>
        {prizes.map((prize, index) => (
          <div key={prize.id ?? index} className={styles.prizeRow}>

            <input
              value={prize.label}
              onChange={(e) =>
                updatePrize(index, "label", e.target.value)
              }
              placeholder="Tên giải"
            />

            <div className={styles.inputWrap}>
              <input
                type="number"
                value={prize.amount}
                min={0}
                onChange={(e) =>
                  updatePrize(index, "amount", e.target.value)
                }
              />
              <Coins size={14} />
            </div>

            <button
              type="button"
              onClick={() => removePrize(index)}
              aria-label="Remove prize"
            >
              <X size={14} />
            </button>

          </div>
        ))}

        <button
          type="button"
          className={styles.addBtn}
          onClick={addPrize}
        >
          <Plus size={16} />
          Thêm hạng mục
        </button>
      </div>

    </div>
  );
};

export default memo(PrizeManager);