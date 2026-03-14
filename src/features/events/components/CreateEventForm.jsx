import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wallet, ChevronRight, Plus, AlertCircle, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useCreateEvent } from "../hooks/useCreateEvent";
import PrizeManager from "./PrizeManager";
import VotingManager from "./VotingManager";
import { DepositModal } from "@/features/wallet";

import styles from "../styles/CreateEventForm.module.scss";

const CreateEventForm = () => {
    const {
        form,
        setForm,
        prizes,
        setPrizes,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        expertBalance,
        totalBudget,
        isOverBudget,
        createEvent,
        reloadBalance
    } = useCreateEvent();

    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState(100);
    const [isDepositSuccess, setIsDepositSuccess] = useState(false);
    const fileInputRef = useRef(null);

    return (
        <div className={styles.container}>
            <header className={styles.mainNav}>
                <div className={styles.brand}>
                    <Sparkles size={20} />
                    <span>Expert Studio</span>
                </div>

                <div className={styles.balanceStatus}>
                    <Wallet size={16} />
                    <span>
                        Số dư: <strong>{expertBalance.toLocaleString()}</strong> Coins
                    </span>
                </div>
            </header>

            <main className={styles.workspace}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.editorGrid}
                >
                    <section className={styles.leftCol}>
                        <div
                            className={styles.mediaBox}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {form.imagePreview ? (
                                <img src={form.imagePreview} alt="preview" />
                            ) : (
                                <div className={styles.placeholder}>
                                    <Plus size={32} />
                                    <p>Tải ảnh bìa sự kiện</p>
                                </div>
                            )}
                            <div className={styles.floatBadge}>Cover Image 16:9</div>
                            <input
                                ref={fileInputRef}
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setForm({
                                            ...form,
                                            imageFile: file,
                                            imagePreview: URL.createObjectURL(file)
                                        });
                                    }
                                }}
                            />
                        </div>

                        <div className={styles.textFields}>
                            <input
                                className={styles.titleInput}
                                placeholder="Tên sự kiện của bạn..."
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                            <textarea
                                className={styles.descInput}
                                placeholder="Viết mô tả chi tiết về sự kiện..."
                                rows={6}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </section>

                    <section className={styles.rightCol}>
                        <div className={styles.configCard}>
                            <div className={styles.cardHeader}>
                                <h3>Thời gian tổ chức</h3>
                            </div>
                            <div className={styles.dateTimeGrid}>
                                <div className={styles.inputGroup}>
                                    <label>Ngày bắt đầu</label>
                                    <div className={styles.pickerWrapper}>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={setStartDate}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            className={styles.customDatePicker}
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Ngày kết thúc</label>
                                    <div className={styles.pickerWrapper}>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={setEndDate}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            className={styles.customDatePicker}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <PrizeManager
                            prizes={prizes}
                            setPrizes={setPrizes}
                            totalBudget={totalBudget}
                            isOverBudget={isOverBudget}
                        />

                        <VotingManager
                            expertWeight={form.expertWeight}
                            setWeight={(val) => setForm({ ...form, expertWeight: val })}
                        />
                    </section>
                </motion.div>
            </main>

            <footer className={styles.actionBar}>
                <div className={styles.statusInfo}>
                    {isOverBudget && (
                        <motion.span
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={styles.errorText}
                        >
                            <AlertCircle size={16} />
                            Thiếu {(totalBudget - expertBalance).toLocaleString()} Coins
                        </motion.span>
                    )}
                </div>

                <div className={styles.actions}>
                    {isOverBudget && (
                        <button
                            className={styles.btnDeposit}
                            onClick={() => setIsDepositOpen(true)}
                        >
                            <Plus size={16} /> Nạp thêm
                        </button>
                    )}

                    <button
                        className={styles.btnPrimary}
                        disabled={isOverBudget || !form.title}
                        onClick={createEvent}
                    >
                        Khai mạc sự kiện
                        <ChevronRight size={18} />
                    </button>
                </div>
            </footer>

            {isDepositOpen && (
                <DepositModal
                    amount={depositAmount}
                    setAmount={setDepositAmount}
                    isSuccess={isDepositSuccess}
                    setIsSuccess={setIsDepositSuccess}
                    onClose={() => setIsDepositOpen(false)}
                    onRefreshBalance={reloadBalance}
                />
            )}
        </div>
    );
};

export default CreateEventForm;