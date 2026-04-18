import React, { useCallback } from "react";
import { Trophy, Coins, X, Plus } from "lucide-react";
import styles from "../../styles/StepPrizes.module.scss";

const StepPrizes = ({ prizes, setPrizes, totalBudget, isOverBudget }) => {

    const validatePrizes = (updatedPrizes) => {
        return updatedPrizes.map((prize, i, arr) => {
            let error = "";

            // 1. Kiểm tra số tiền phải > 0
            if (!prize.amount || prize.amount <= 0) {
                error = "Amount must be greater than 0";
            }
            // 2. Kiểm tra thứ tự: Giải sau không được lớn hơn giải trước
            else if (i > 0 && prize.amount > arr[i - 1].amount) {
                error = `It must not be greater than ${arr[i - 1].label}`;
            }
            // 3. Kiểm tra thứ tự: Giải trước không được nhỏ hơn giải sau
            else if (i < arr.length - 1 && arr[i + 1].amount > 0 && prize.amount < arr[i + 1].amount) {
                error = `It must not be smaller than ${arr[i + 1].label}`;
            }

            return { ...prize, error };
        });
    };

    const updatePrize = useCallback((index, field, value) => {
        setPrizes(prev => {
            const newValue = field === "amount" ? Number(value) : value;
            const updated = prev.map((prize, i) =>
                i === index ? { ...prize, [field]: newValue } : prize
            );
            return validatePrizes(updated);
        });
    }, [setPrizes]);

    const addPrize = useCallback(() => {
        setPrizes(prev => {
            const nextNumber = prev.length + 1;
            const updated = [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    label: `Prize ${nextNumber}`,
                    amount: 0,
                    error: ""
                }
            ];
            return validatePrizes(updated);
        });
    }, [setPrizes]);

    const removePrize = useCallback((index) => {
        if (prizes.length <= 1) return;

        setPrizes(prev => {
            const filtered = prev.filter((_, i) => i !== index);
            const renamed = filtered.map((prize, i) => ({
                ...prize,
                label: `Giải ${i + 1}`
            }));
            return validatePrizes(renamed);
        });
    }, [prizes.length, setPrizes]);

    return (
        <section className={styles.section}>
            <header className={styles.stepHeader}>
                <h2 className={styles.sectionTitle}>Prize structure</h2>
                <p className={styles.sectionSub}>Set up reward categories for the winners</p>
            </header>

            <div className={styles.configCard}>
                <div className={styles.cardHeader}>
                    <Trophy size={18} />
                    <h3>Prize mechanism</h3>
                    <div className={`${styles.totalBadge} ${isOverBudget ? styles.err : ""}`}>
                        Total: {totalBudget.toLocaleString()} VND
                    </div>
                </div>

                <div className={styles.prizeScroll}>
                    {prizes.map((prize, index) => (
                        // Bọc trong một Container để quản lý dòng lỗi
                        <div key={prize.id || index} className={styles.prizeItemBlock}>
                            <div className={`${styles.prizeRow} ${prize.error ? styles.rowError : ""}`}>

                                <div className={styles.prizeLabelContainer}>
                                    <span className={styles.prizeLabelText}>{prize.label}</span>
                                </div>

                                <div className={`${styles.inputWrap} ${prize.error ? styles.inputErr : ""}`}>
                                    <input
                                        type="number"
                                        value={prize.amount || ""}
                                        min={0}
                                        onChange={(e) => updatePrize(index, "amount", e.target.value)}
                                        placeholder="0"
                                    />
                                    <Coins size={14} />
                                </div>

                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => removePrize(index)}
                                    disabled={prizes.length <= 1}
                                    aria-label="Remove prize"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Hiển thị lỗi ngay dưới dòng nếu có */}
                            {prize.error && (
                                <div className={styles.inlineError}>
                                    {prize.error}
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={addPrize}
                    >
                        <Plus size={16} />
                        Add prize category
                    </button>
                </div>
            </div>

            {isOverBudget && (
                <div className={styles.budgetError} style={{ marginTop: '1rem' }}>
                    The current balance is not enough to cover the total prize pool.
                </div>
            )}
        </section>
    );
};

export default StepPrizes;