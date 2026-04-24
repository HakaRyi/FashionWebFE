import { useCallback, useState } from "react";
import { Trophy, Coins, X, Plus, Ticket, Check } from "lucide-react";
import styles from "../../styles/StepPrizes.module.scss";

const StepPrizes = ({ form, setForm, prizes, setPrizes, totalBudget, isOverBudget }) => {

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

    const [isFeeEnabled, setIsFeeEnabled] = useState((form.entryFee || 0) > 0);
    const firstPrizeAmount = prizes[0]?.amount || 0;
    const isFeeHigherThanFirstPrize = form.entryFee > firstPrizeAmount && firstPrizeAmount > 0;

    const handleToggleFee = () => {
        const newState = !isFeeEnabled;
        setIsFeeEnabled(newState);
        if (!newState) {
            setForm(prev => ({ ...prev, entryFee: 0 }));
        }
    };

    const handleEntryFeeChange = (e) => {
        const val = e.target.value === "" ? 0 : Number(e.target.value);
        if (val < 0) return;
        setForm(prev => ({ ...prev, entryFee: val }));
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

            <div className={styles.feeCard}>
                <div className={styles.feeHeader} onClick={handleToggleFee}>
                    <div className={styles.feeInfo}>
                        <div className={styles.iconBox}>
                            <Ticket size={20} />
                        </div>
                        <div className={styles.texts}>
                            <h3>Participation Fee</h3>
                            <p>Charge a small fee for users to join this event</p>
                        </div>
                    </div>
                    <div className={`${styles.toggleSwitch} ${isFeeEnabled ? styles.active : ""}`}>
                        <div className={styles.switchHandle}>
                            {isFeeEnabled && <Check size={12} />}
                        </div>
                    </div>
                </div>

                {isFeeEnabled && (
                    <div className={styles.feeInputExpanded}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputWrap}>
                                <input
                                    type="number"
                                    value={form.entryFee || ""}
                                    onChange={handleEntryFeeChange}
                                    placeholder="Enter amount..."
                                    min={0}
                                    autoFocus
                                />
                                <span className={styles.currency}>VND</span>
                            </div>
                            {isFeeHigherThanFirstPrize && (
                                <p className={styles.warningText}>
                                    ⚠️ Participation fee is higher than the First Prize ({firstPrizeAmount.toLocaleString()} VND).
                                </p>
                            )}
                            <p className={styles.note}>
                                * This revenue will be collected and sent to your wallet after the event ends.
                            </p>
                        </div>
                    </div>
                )}
            </div>

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