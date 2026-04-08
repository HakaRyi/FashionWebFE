import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Wallet, FileText, Users, Award, Send,
    ChevronRight, ChevronLeft, CheckCircle2, ListChecks
} from "lucide-react";

import { useCreateEvent } from "../hooks/useCreateEvent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/app/routes/paths";
import { validateEventForm } from "../utils/eventValidation";

import StepBasicInfo from "./steps/StepBasicInfo";
import StepExperts from "./steps/StepExperts";
import StepCriteria from "./steps/StepCriteria";
import StepPrizes from "./steps/StepPrizes";
import StepPublish from "./steps/StepPublish";
import { DepositModal } from "@/features/wallet";
import { set, get, del } from 'idb-keyval';

import styles from "../styles/CreateEventForm.module.scss";

const STEPS = [
    { id: 1, title: "Nội dung", icon: <FileText size={18} /> },
    { id: 2, title: "Expert", icon: <Users size={18} /> },
    { id: 3, title: "Tiêu chí", icon: <ListChecks size={18} /> },
    { id: 4, title: "Giải thưởng", icon: <Award size={18} /> },
    { id: 5, title: "Xác nhận", icon: <Send size={18} /> },
];

const STEP_COMPONENTS = {
    1: StepBasicInfo,
    2: StepExperts,
    3: StepCriteria,
    4: StepPrizes,
    5: StepPublish,
};

const CreateEventForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [isDepositSuccess, setIsDepositSuccess] = useState(false);

    const {
        form, setForm,
        criteria, setCriteria, prizes, setPrizes,
        startDate, setStartDate, endDate, setEndDate,
        submissionDeadline, setSubmissionDeadline, setInvitedExpertIds,
        expertBalance, totalBudget, totalRequired, isOverBudget,
        createEvent, invitedExpertIds, toggleExpert, loading, refreshBalance,
        validateStep, platformFee, feePercentage, metadata
    } = useCreateEvent();

    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const restoreDraft = async () => {
            const savedDraft = localStorage.getItem("event_draft");
            if (!savedDraft) return;

            try {
                const draft = JSON.parse(savedDraft);

                setForm(draft.form);
                setCriteria(draft.criteria);
                setPrizes(draft.prizes);
                setStartDate(draft.startDate ? new Date(draft.startDate) : null);
                setEndDate(draft.endDate ? new Date(draft.endDate) : null);
                setSubmissionDeadline(draft.submissionDeadline ? new Date(draft.submissionDeadline) : null);
                if (draft.invitedExpertIds) {
                    setInvitedExpertIds(draft.invitedExpertIds);
                }
                setStep(draft.currentStep || 1);

                const savedFile = await get("event_banner_file");
                let bannerFile = null;
                if (savedFile) {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(URL.createObjectURL(savedFile));
                    bannerFile = savedFile;
                    await del("event_banner_file");
                }

                setForm(prev => ({
                    ...prev,
                    ...draft.form,
                    banner: bannerFile || draft.form.banner || prev.banner,
                    expertWeight: draft.form.expertWeight ?? prev.expertWeight
                }));

                localStorage.removeItem("event_draft");
                toast.info("Đã khôi phục dữ liệu bản nháp của bạn.");
                refreshBalance();

            } catch (e) {
                console.error("Lỗi khôi phục bản nháp:", e);
            }
        };

        restoreDraft();
    }, [setForm, setCriteria, setPrizes, setStartDate, setEndDate, setSubmissionDeadline, refreshBalance]);

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
        if (step === 3) {
            const hasEmptyName = criteria.some(c => !c.name || c.name.trim() === '');
            if (hasEmptyName) {
                toast.warn("Vui lòng nhập tên cho tất cả các tiêu chí.");
                return;
            }

            const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weightPercentage || 0), 0);
            if (totalWeight !== 100) {
                toast.warn(`Tổng trọng số đang là ${totalWeight}%. Vui lòng điều chỉnh để tổng bằng đúng 100%.`);
                return;
            }
        }

        if (step === 4) {
            const hasInvalidPrize = prizes.some(p => !p.amount || p.amount <= 0);
            if (hasInvalidPrize) {
                toast.warn("Vui lòng nhập số tiền thưởng hợp lệ cho tất cả các giải.");
                return;
            }
        }

        const isValid = validateStep(step);

        if (!isValid) {
            if (step === 2) {
                const minConfig = metadata?.expertRules?.minRequired;

                const minExpertsToInvite = minConfig - 1;

                if (invitedExpertIds.length < minExpertsToInvite) {
                    toast.warn(`Vui lòng mời ít nhất ${minExpertsToInvite} chuyên gia để tiếp tục.`);
                }
            } else if (step === 1) {
                toast.warn("Vui lòng điền đầy đủ tiêu đề, mô tả và ảnh bìa.");
            }
            return;
        }
        setStep(p => p + 1);
    };

    const saveDraft = async () => {
        const draftData = {
            form: { ...form, banner: null },
            criteria,
            prizes,
            startDate,
            endDate,
            submissionDeadline,
            invitedExpertIds,
            currentStep: step
        };

        localStorage.setItem("event_draft", JSON.stringify(draftData));

        if (form.banner instanceof File) {
            await set("event_banner_file", form.banner);
        }
    };

    const onPublishEvent = async () => {
        if (loading) return;

        const validation = validateEventForm(form, prizes, startDate, endDate, Infinity);
        if (!validation.isValid) return toast.warning(validation.message);

        if (isOverBudget) {
            await saveDraft();
            const gap = totalRequired - expertBalance;
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
                    <div className={styles.navRight}>
                        <div className={`${styles.walletPill} ${isOverBudget ? styles.danger : ''}`}>
                            <div className={styles.walletIcon}>
                                <Wallet size={14} />
                            </div>
                            <div className={styles.walletInfo}>
                                <small>Số dư ví</small>
                                <strong>{(expertBalance || 0).toLocaleString()}đ</strong>
                            </div>
                        </div>
                    </div>
                </header>

                <div className={styles.contentScroll}>
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
                                    criteria={criteria} setCriteria={setCriteria}
                                    prizes={prizes} setPrizes={setPrizes}
                                    startDate={startDate} setStartDate={setStartDate}
                                    submissionDeadline={submissionDeadline}
                                    setSubmissionDeadline={setSubmissionDeadline}
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
                                    feePercentage={feePercentage}
                                    platformFee={platformFee}
                                    expertBalance={expertBalance}
                                    metadata={metadata}
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
                            {step < 5 ? (
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
                        onRefreshBalance={refreshBalance}
                    />
                )}
            </main>
        </div>
    );
};

export default CreateEventForm;