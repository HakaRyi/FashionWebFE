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
    { id: 1, title: "Content", icon: <FileText size={18} /> },
    { id: 2, title: "Expert", icon: <Users size={18} /> },
    { id: 3, title: "Criteria", icon: <ListChecks size={18} /> },
    { id: 4, title: "Prizes", icon: <Award size={18} /> },
    { id: 5, title: "Confirm", icon: <Send size={18} /> },
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
                toast.info("Your draft data has been recovered.");
                refreshBalance();

            } catch (e) {
                console.error("Draft recovery error:", e);
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
                toast.warn("Please enter names for all criteria.");
                return;
            }

            const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weightPercentage || 0), 0);
            if (totalWeight !== 100) {
                toast.warn(`The total weight is ${totalWeight}%. Please adjust to make the total exactly 100%.`);
                return;
            }
        }

        if (step === 4) {
            const hasError = prizes.some(p => p.error !== "");
            const hasEmpty = prizes.some(p => !p.amount || p.amount <= 0);

            if (hasError || hasEmpty) {
                toast.error("Please fix the errors in the prize structure before continuing.");
                return;
            }
        }

        const isValid = validateStep(step);

        if (!isValid) {
            if (step === 2) {
                const minConfig = metadata?.expertRules?.minRequired;

                const minExpertsToInvite = minConfig - 1;

                if (invitedExpertIds.length < minExpertsToInvite) {
                    toast.warn(`Please invite at least ${minExpertsToInvite} experts to continue.`);
                }
            } else if (step === 1) {
                toast.warn("Please fill in all the required fields for the event title, description, and banner.");
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

        await saveDraft();

        if (isOverBudget) {
            await saveDraft();
            const gap = totalRequired - expertBalance;
            setDepositAmount(Math.ceil(gap));
            setShowDepositModal(true);
            return;
        }

        toast.promise(createEvent(), {
            pending: 'Creating event...',
            success: {
                render() {
                    setTimeout(() => navigate(PATHS.EXPERT_EVENTS), 1500);
                    return "Event created successfully!";
                }
            },
            error: { render: ({ data }) => `${data?.message || "Error creating event"}` }
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
                                <small>Wallet balance</small>
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
                                    {loading ? "Processing..." : (isOverBudget ? "Deposit & Confirm" : "Confirm & Pay")}
                                </button>
                            )}
                        </div>
                    </div>
                </footer>

                {showDepositModal && (
                    <DepositModal
                        isSuccess={isDepositSuccess}
                        setIsSuccess={setIsDepositSuccess}
                        isFixedAmount={true}
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