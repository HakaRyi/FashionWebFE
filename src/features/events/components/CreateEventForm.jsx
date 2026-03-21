import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Wallet, FileText, Users, Award, Send,
    ChevronRight, ChevronLeft, CheckCircle2
} from "lucide-react";

import { useCreateEvent } from "../hooks/useCreateEvent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/app/routes/paths";
import { validateEventForm } from "../utils/eventValidation";

import StepBasicInfo from "./steps/StepBasicInfo";
import StepExperts from "./steps/StepExperts";
import StepPrizes from "./steps/StepPrizes";
import StepPublish from "./steps/StepPublish";
import { DepositModal } from "@/features/wallet";

import styles from "../styles/CreateEventForm.module.scss";

const STEPS = [
    { id: 1, title: "Nội dung", icon: <FileText size={18} /> },
    { id: 2, title: "Expert", icon: <Users size={18} /> },
    { id: 3, title: "Giải thưởng", icon: <Award size={18} /> },
    { id: 4, title: "Xác nhận", icon: <Send size={18} /> },
];

const STEP_COMPONENTS = {
    1: StepBasicInfo,
    2: StepExperts,
    3: StepPrizes,
    4: StepPublish,
};

const CreateEventForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [isDepositSuccess, setIsDepositSuccess] = useState(false);

    const {
        form, setForm, prizes, setPrizes,
        startDate, setStartDate, endDate, setEndDate,
        expertBalance, totalBudget, totalRequired, isOverBudget,
        createEvent, invitedExpertIds, toggleExpert, loading, fetchBalance,
        validateStep, platformFee,
    } = useCreateEvent();

    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setForm(prev => ({ ...prev, banner: file }));
    };

    const handleNextStep = () => {
        const isValid = validateStep(step);
        if (!isValid) {
            if (step === 2 && invitedExpertIds.length === 0) {
                toast.warn("Chưa chọn Expert! Vui lòng chọn ít nhất 1 người để tiếp tục.");
            } else if (step === 1) {
                toast.warn("Vui lòng điền đầy đủ tiêu đề, mô tả và ảnh bìa.");
            }
            return;
        }
        setStep(p => p + 1);
    };

    const onPublishEvent = async () => {
        const validation = validateEventForm(form, prizes, startDate, endDate, Infinity);
        if (!validation.isValid) return toast.warning(validation.message);

        if (isOverBudget) {
            const gap = totalRequired - expertBalance;
            // Giả sử quy đổi nạp tiền
            setDepositAmount(Math.ceil(gap));
            setShowDepositModal(true);
            return;
        }

        toast.promise(createEvent(), {
            pending: '🚀 Đang khởi tạo sự kiện...',
            success: {
                render() {
                    setTimeout(() => navigate(PATHS.EXPERT_EVENTS), 1500);
                    return "Khai mạc sự kiện thành công! 🎉";
                }
            },
            error: { render: ({ data }) => `${data?.message || "Lỗi tạo sự kiện"}` }
        });
    };

    const CurrentStep = STEP_COMPONENTS[step];

    return (
        <div className={styles.studioContainer}>
            <main className={styles.viewport}>
                <header className={styles.topNav}>
                    <div className={styles.navLeft}>
                        <div className={styles.path}>Events / New Event</div>
                    </div>
                    <nav className={styles.horizontalStepper}>
                        {STEPS.map((s, index) => (
                            <div key={s.id} className={styles.stepItemWrapper}>
                                <div className={`${styles.stepItem} ${step === s.id ? styles.active : ''} ${step > s.id ? styles.done : ''}`}>
                                    <div className={styles.stepIcon}>
                                        {step > s.id ? <CheckCircle2 size={16} /> : s.icon}
                                    </div>
                                    <span className={styles.stepLabel}>{s.title}</span>
                                </div>
                                {index < STEPS.length - 1 && <div className={styles.stepLine} />}
                            </div>
                        ))}
                    </nav>
                </header>

                <div className={styles.contentScroll}>
                    <div className={styles.topStatusBoard}>
                        <div className={styles.statusCard}>
                            <div className={styles.iconCircle}><Wallet size={16} /></div>
                            <div className={styles.statusText}>
                                <small>Số dư ví</small>
                                <strong>{(expertBalance || 0).toLocaleString()} VND</strong>
                            </div>
                        </div>

                        <div className={`${styles.statusCard} ${isOverBudget ? styles.danger : ''}`}>
                            <div className={styles.iconCircle}><Sparkles size={16} /></div>
                            <div className={styles.statusText}>
                                <small>Tổng chi phí (+5% phí)</small>
                                <strong>{(totalRequired || 0).toLocaleString()} VND</strong>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formContainer}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CurrentStep
                                    form={form} setForm={setForm}
                                    prizes={prizes} setPrizes={setPrizes}
                                    startDate={startDate} setStartDate={setStartDate}
                                    endDate={endDate} setEndDate={setEndDate}
                                    previewUrl={previewUrl}
                                    fileInputRef={fileInputRef}
                                    handleUploadClick={() => fileInputRef.current?.click()}
                                    handleFileChange={handleFileChange}
                                    invitedExpertIds={invitedExpertIds}
                                    toggleExpert={toggleExpert}
                                    totalBudget={totalBudget}
                                    totalRequired={totalRequired}
                                    isOverBudget={isOverBudget}
                                    platformFee={platformFee}
                                    expertBalance={expertBalance}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <footer className={styles.actionFooter}>
                    <div className={styles.footerContent}>
                        <button
                            className={styles.btnBack}
                            onClick={() => setStep(p => p - 1)}
                            disabled={step === 1 || loading}
                        >
                            <ChevronLeft size={18} /> Quay lại
                        </button>

                        <div className={styles.rightButtons}>
                            {step < 4 ? (
                                <button className={styles.btnNext} onClick={handleNextStep} >
                                    Tiếp theo <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    className={isOverBudget ? styles.btnDeposit : styles.btnSubmit}
                                    onClick={onPublishEvent}
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : (isOverBudget ? "Nạp tiền & Xác nhận" : "Xác nhận & Thanh toán")}
                                </button>
                            )}
                        </div>
                    </div>
                </footer>

                {showDepositModal && (
                    <DepositModal
                        isSuccess={isDepositSuccess}
                        setIsSuccess={setIsDepositSuccess}
                        amount={depositAmount}
                        onClose={() => {
                            setShowDepositModal(false);
                            setIsDepositSuccess(false);
                        }}
                        onRefreshBalance={fetchBalance}
                    />
                )}
            </main>
        </div>
    );
};

export default CreateEventForm;