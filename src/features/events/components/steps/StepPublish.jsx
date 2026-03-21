import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, Check, ShieldCheck } from "lucide-react";
import styles from "../../styles/StepPublish.module.scss";

const StepPublish = ({
    form,
    setForm,
    invitedExpertIds = [],
    totalBudget,    // Tổng tiền giải thưởng
    platformFee,    // Phí 5% tính từ Hook
    totalRequired,// Tổng tiền cần thanh toán tính từ Hook
    isOverBudget,
    expertBalance,
}) => {

    const updateFormField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const maxExperts = Math.max(0, invitedExpertIds.length);
    const currentMinExperts = form.minExpertsRequired || 1;

    return (
        <section className={styles.section}>
            <header className={styles.stepHeader}>
                <h2 className={styles.sectionTitle}>Cấu hình xuất bản</h2>
                <p className={styles.sectionSub}>Xác nhận tài chính và thiết lập điều kiện bắt đầu</p>
            </header>

            <div className={styles.publishOptions}>
                {/* LỰA CHỌN THỦ CÔNG */}
                <div
                    className={`${styles.publishCard} ${!form.isAutoActivate ? styles.activeCard : ''}`}
                    onClick={() => updateFormField('isAutoActivate', false)}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.radioCircle}>
                            {!form.isAutoActivate && <div className={styles.radioInner} />}
                        </div>
                        <div className={styles.cardInfo}>
                            <h4>Kích hoạt thủ công</h4>
                            <p>Sự kiện sẽ ở trạng thái <b>Chờ duyệt</b>. Bạn sẽ tự tay bấm "Bắt đầu" sau khi hệ thống phê duyệt.</p>
                        </div>
                    </div>
                </div>

                {/* LỰA CHỌN TỰ ĐỘNG */}
                <div
                    className={`${styles.publishCard} ${form.isAutoActivate ? styles.activeCard : ''}`}
                    onClick={() => updateFormField('isAutoActivate', true)}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.radioCircle}>
                            {form.isAutoActivate && <div className={styles.radioInner} />}
                        </div>
                        <div className={styles.cardInfo}>
                            <h4>Kích hoạt tự động</h4>
                            <p>Sự kiện tự động "Lên sàn" ngay khi đạt đủ số lượng Expert xác nhận tham gia.</p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {form.isAutoActivate && (
                            <motion.div
                                className={styles.autoConfig}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <div className={styles.divider}></div>
                                <div className={styles.configField}>
                                    <label>
                                        <Info size={14} /> Số Expert tối thiểu cần đồng ý:
                                    </label>

                                    {maxExperts > 0 ? (
                                        <div className={styles.counterWrapper}>
                                            <div className={styles.counterGroup}>
                                                <button
                                                    type="button"
                                                    className={styles.countBtn}
                                                    disabled={currentMinExperts <= 1}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateFormField('minExpertsRequired', Math.max(1, currentMinExperts - 1));
                                                    }}
                                                > - </button>

                                                <div className={styles.countValue}>
                                                    <strong>{currentMinExperts}</strong>
                                                    <span>/ {maxExperts}</span>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={styles.countBtn}
                                                    disabled={currentMinExperts >= maxExperts}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateFormField('minExpertsRequired', Math.min(maxExperts, currentMinExperts + 1));
                                                    }}
                                                > + </button>
                                            </div>
                                            <p className={styles.configHint}>
                                                {currentMinExperts === maxExperts
                                                    ? "Yêu cầu tất cả Expert được mời phải xác nhận."
                                                    : `Chỉ cần ít nhất ${currentMinExperts} Expert xác nhận là sự kiện sẽ chạy.`}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className={styles.textWarning}>Bạn chưa chọn Expert nào ở Bước 2.</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* PHẦN THANH TOÁN */}
            <div className={styles.billingContainer}>
                <h3 className={styles.subTitle}>Tóm tắt tài chính</h3>

                <div className={styles.billingTable}>
                    <div className={styles.billingRow}>
                        <span>Tổng giải thưởng (Prizes)</span>
                        <span>{(totalBudget || 0).toLocaleString()} VND</span>
                    </div>

                    <div className={styles.billingRow}>
                        <span>Phí nền tảng (5%)</span>
                        <span>{(platformFee || 0).toLocaleString()} VND</span>
                    </div>

                    <div className={styles.billingDivider}></div>

                    <div className={`${styles.billingRow} ${styles.totalRow}`}>
                        <strong>Tổng cộng thanh toán</strong>
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
                            <strong>Số dư không đủ</strong>
                            <span>Bạn cần nạp thêm ít nhất {(totalRequired - expertBalance).toLocaleString()} VND để tiếp tục.</span>
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
                    <strong>Quyền lợi của Organizer:</strong>
                    <ul>
                        <li>Ngân sách sẽ được hệ thống <b>tạm giữ an toàn (Escrow)</b>.</li>
                        <li><b>Hoàn tiền 100%:</b> Nếu sự kiện bị hủy hoặc không đủ Expert xác nhận.</li>
                        <li>Phí dịch vụ 5% chỉ được tính khi sự kiện chính thức bắt đầu.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default StepPublish;