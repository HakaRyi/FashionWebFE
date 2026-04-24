import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, Check, ShieldCheck } from "lucide-react";
import styles from "../../styles/StepPublish.module.scss";

const StepPublish = ({
    form,
    setForm,
    invitedExpertIds = [],
    totalBudget,
    platformFee,
    totalRequired,
    isOverBudget,
    expertBalance,
    metadata
}) => {

    const updateFormField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const systemMinRequired = metadata?.expertRules?.minRequired || 2;
    const maxExperts = Math.max(0, invitedExpertIds.length);
    const currentMinExperts = form.minExpertsRequired || systemMinRequired;
    const minLimit = metadata?.expertRules?.minRequired || 2;
    const maxLimit = invitedExpertIds.length;

    return (
        <section className={styles.section}>
            <header className={styles.stepHeader}>
                <h2 className={styles.sectionTitle}>Publishing configuration</h2>
                <p className={styles.sectionSub}>Confirm your finances and set the conditions for starting.</p>
            </header>

            <div className={styles.publishOptions}>
                {/* LỰA CHỌN THỦ CÔNG */}
                <div
                    className={`${styles.publishCard} ${!form.isAutoStart ? styles.activeCard : ''}`}
                    onClick={() => updateFormField('isAutoStart', false)}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.radioCircle}>
                            {!form.isAutoStart && <div className={styles.radioInner} />}
                        </div>
                        <div className={styles.cardInfo}>
                            <h4>Manual Activation</h4>
                            <p>The event will be in a <b>Pending Approval</b> state. You will manually click "Start" after the system approves it.</p>
                            <div className={styles.manualNote}>
                                <Check size={14} />
                                <span>Note: You can only start when you have at least <b>{systemMinRequired - 1} expert</b> confirmed participation.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LỰA CHỌN TỰ ĐỘNG */}
                <div
                    className={`${styles.publishCard} ${form.isAutoStart ? styles.activeCard : ''}`}
                    onClick={() => updateFormField('isAutoStart', true)}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.radioCircle}>
                            {form.isAutoStart && <div className={styles.radioInner} />}
                        </div>
                        <div className={styles.cardInfo}>
                            <h4>Automatic Activation</h4>
                            <p>The event will automatically go "Live" as soon as it reaches the required number of expert confirmations.</p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {form.isAutoStart && (
                            <motion.div
                                className={styles.autoConfig}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <div className={styles.divider}></div>
                                <div className={styles.configField}>
                                    <label>
                                        <Info size={14} /> Minimum number of experts required to start the event:
                                    </label>

                                    {maxExperts > 0 ? (
                                        <div className={styles.counterWrapper}>
                                            <div className={styles.counterGroup}>
                                                <button
                                                    type="button"
                                                    className={styles.countBtn}
                                                    disabled={currentMinExperts <= minLimit}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (currentMinExperts > minLimit) {
                                                            updateFormField('minExpertsRequired', currentMinExperts - 1);
                                                        }
                                                    }}
                                                > - </button>

                                                <div className={styles.countValue}>
                                                    <strong>{currentMinExperts}</strong>
                                                    <span>/ {maxExperts}</span>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={styles.countBtn}
                                                    disabled={currentMinExperts >= maxLimit}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (currentMinExperts < maxLimit) {
                                                            updateFormField('minExpertsRequired', currentMinExperts + 1);
                                                        }
                                                    }}
                                                > + </button>
                                            </div>
                                            <p className={styles.configHint}>
                                                {currentMinExperts === maxExperts
                                                    ? "All invited experts must confirm their participation."
                                                    : `At least ${currentMinExperts} expert must confirm their participation for the event to proceed.`}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className={styles.textWarning}>You haven't selected an Expert in Step 2.</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* PHẦN THANH TOÁN */}
            <div className={styles.billingContainer}>
                <h3 className={styles.subTitle}>Financial Summary</h3>

                <div className={styles.billingTable}>
                    <div className={styles.billingRow}>
                        <div className={styles.labelWithIcon}>
                            <span>Entry Fee (per participant)</span>
                        </div>
                        <span className={form.entryFee > 0 ? styles.textPrimary : ''}>
                            {form.entryFee > 0
                                ? `${Number(form.entryFee).toLocaleString()} VND`
                                : "Free Entry"}
                        </span>
                    </div>

                    <div className={styles.billingDivider}></div>

                    <div className={styles.billingRow}>
                        <span>Total Prizes</span>
                        <span>{(totalBudget || 0).toLocaleString()} VND</span>
                    </div>

                    <div className={styles.billingRow}>
                        <div className={styles.feeLabelGroup}>
                            <span>Platform Service Fee</span>
                            {/* <span className={styles.feeBadge}>Fixed Fee</span> */}
                        </div>
                        <div className={styles.feeValueGroup}>
                            <span>{(platformFee || 0).toLocaleString()} VND</span>
                            <small className={styles.feeNote}>
                                (Standard processing fee for all events)
                            </small>
                        </div>
                    </div>

                    {/* <div className={styles.billingDivider}></div> */}

                    <div className={`${styles.billingRow} ${styles.totalRow}`}>
                        <strong>Total Payment</strong>
                        <div className={styles.totalPrice}>
                            <strong className={isOverBudget ? styles.textDanger : styles.textSuccess}>
                                {(totalRequired || 0).toLocaleString()} VND
                            </strong>
                        </div>
                    </div>
                </div>

                {isOverBudget && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.budgetError}
                    >
                        <AlertTriangle size={18} />
                        <div>
                            <strong>Insufficient Balance</strong>
                            <span>You need to deposit at least {(totalRequired - expertBalance).toLocaleString()} VND to continue.</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* CHÍNH SÁCH BẢO VỆ */}
            <div className={styles.infoBox}>
                <div className={styles.infoIcon}>
                    <ShieldCheck size={20} />
                </div>
                <div className={styles.infoContent}>
                    <strong>Organizer Benefits:</strong>
                    <ul>
                        <li>The budget will be securely held by the system.</li>
                        <li><b>100% Refund:</b> If the event is canceled or doesn't have enough expert confirmations.</li>
                        <li>Service fees are only charged when the event officially starts.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default StepPublish;