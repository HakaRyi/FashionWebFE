import React, { useCallback } from "react";
import { Trophy, Coins, X, Plus } from "lucide-react";
import styles from "../../styles/StepPrizes.module.scss";

const StepPrizes = ({ prizes, setPrizes, totalBudget, isOverBudget }) => {

    const updatePrize = useCallback((index, field, value) => {
        setPrizes(prev =>
            prev.map((prize, i) =>
                i === index
                    ? { ...prize, [field]: field === "amount" ? Number(value) : value }
                    : prize
            )
        );
    }, [setPrizes]);

    const addPrize = useCallback(() => {
        setPrizes(prev => {
            const nextNumber = prev.length + 1;
            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    label: `Giải ${nextNumber}`,
                    amount: 0
                }
            ];
        });
    }, [setPrizes]);

    const removePrize = useCallback((index) => {
        if (prizes.length <= 1) return;

        setPrizes(prev => {
            const filtered = prev.filter((_, i) => i !== index);
            return filtered.map((prize, i) => ({
                ...prize,
                label: `Giải ${i + 1}`
            }));
        });
    }, [prizes.length, setPrizes]);

    return (
        <section className={styles.section}>
            <header className={styles.stepHeader}>
                <h2 className={styles.sectionTitle}>Cơ cấu giải thưởng</h2>
                <p className={styles.sectionSub}>Thiết lập các hạng mục phần thưởng cho người thắng cuộc</p>
            </header>

            {/* Sử dụng class cũ: configCard */}
            <div className={styles.configCard}>

                <div className={styles.cardHeader}>
                    <Trophy size={18} />
                    <h3>Cơ chế giải thưởng</h3>

                    {/* Sử dụng class cũ: totalBadge và err */}
                    <div className={`${styles.totalBadge} ${isOverBudget ? styles.err : ""}`}>
                        Tổng: {totalBudget.toLocaleString()} VND
                    </div>
                </div>

                {/* Sử dụng class cũ: prizeScroll */}
                <div className={styles.prizeScroll}>
                    {prizes.map((prize, index) => (
                        <div key={prize.id || index} className={styles.prizeRow}>

                            {/* Input giải */}
                            <div className={styles.prizeLabelContainer} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                minWidth: '100px',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}>
                                <span style={{ 
                                    background: '#eff6ff', 
                                    color: '#3b82f6',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem'
                                }}>
                                </span>
                                <span>Giải {index + 1}</span>
                            </div>

                            <div className={styles.inputWrap}>
                                <input
                                    type="number"
                                    value={prize.amount || ""}
                                    min={0}
                                    onChange={(e) => updatePrize(index, "amount", e.target.value)}
                                    placeholder="0"
                                />
                                <Coins size={14} />
                            </div>

                            {/* Nút xóa với logic cũ */}
                            <button
                                type="button"
                                onClick={() => removePrize(index)}
                                disabled={prizes.length <= 1}
                                aria-label="Remove prize"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}

                    {/* Sử dụng class cũ: addBtn */}
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

            {/* Cảnh báo nếu vượt ngân sách (Dùng style từ form chung) */}
            {isOverBudget && (
                <div className={styles.budgetError} style={{ marginTop: '1rem' }}>
                    Số dư hiện tại không đủ để chi trả cho tổng giải thưởng này.
                </div>
            )}
        </section>
    );
};

export default StepPrizes;