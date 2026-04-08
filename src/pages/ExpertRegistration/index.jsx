import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Calendar, RefreshCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/app/routes/paths";
import styles from "@/features/expert/styles/ExpertApplication.module.scss";

import {
    LandingSection,
    StepExpertise,
    StepVerification,
    SuccessState,
    useExpertApplication,
    ReviewModal
} from "@/features/expert";

const ExpertApplicationPage = () => {

    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const {
        step,
        setStep,
        loading,
        initialLoading,
        applicationStatus,
        formData,
        updateFormData,
        submitApplication
    } = useExpertApplication();

    if (initialLoading) return <div>Loading...</div>;

    if (applicationStatus === "Approved") {
        return (
            <div className={styles.container}>
                <div className={styles.infoState}>
                    <h2>Bạn đã là Chuyên gia!</h2>
                    <p>Hồ sơ của bạn đã được xác thực. Bạn có thể bắt đầu cung cấp dịch vụ ngay bây giờ.</p>
                    <button className={styles.btnPrimary} onClick={() => navigate(PATHS.EXPERT_DASHBOARD)}>
                        Go to Expert Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (applicationStatus.status === "Pending" && step !== 3) {
        return (
            <div className={styles.container}>
                <div className={styles.infoState}>
                    <div className={styles.pendingIcon}>⏳</div>
                    <h2>Đơn đăng ký đang được xét duyệt</h2>
                    <p>Hệ thống đang kiểm tra hồ sơ của bạn. Vui lòng đợi trong 24-48h.</p>
                    <button className={styles.btnSecondary} onClick={() => navigate(PATHS.USER_FEED)}>
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    if (applicationStatus.status === "Rejected" && !showForm) {
        return (
            <div className={styles.expertStatusWrapper}>
                <div className={`${styles.statusMainCard} ${styles.rejectedSection}`}>
                    <div className={styles.iconCircle}>
                        <AlertCircle size={48} color="#ff4d4f" />
                    </div>
                    <h2>Hồ sơ chưa được phê duyệt</h2>

                    <div className={styles.reasonBox}>
                        <span className={styles.label}>Lý do từ chối:</span>
                        <span className={styles.text}>"{applicationStatus.reason}"</span>

                        <div className={styles.dateInfo}>
                            <Calendar size={14} />
                            <span>Xử lý ngày: {new Date(applicationStatus.processedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>

                    <div className={styles.buttonGrid}>
                        <button className={`${styles.actionBtn} ${styles.outline}`} onClick={() => setShowReview(true)}>
                            <Eye size={18} /> Xem lại hồ sơ
                        </button>

                        <button className={`${styles.actionBtn} ${styles.primary}`} onClick={() => setShowForm(true)}>
                            <RefreshCcw size={18} /> Cập nhật nộp lại
                        </button>
                    </div>

                    <button className={`${styles.actionBtn} ${styles.ghost}`} onClick={() => navigate(PATHS.USER_FEED)}>
                        Để sau
                    </button>
                </div>

                <AnimatePresence>
                    {showReview && (
                        <ReviewModal
                            data={applicationStatus.submittedData}
                            onClose={() => setShowReview(false)}
                        />
                    )}
                </AnimatePresence>
            </div>
        );
    }


return (
    <div className={styles.container}>

        <AnimatePresence mode="wait">

            {!showForm ? (

                <LandingSection onStart={() => setShowForm(true)} />

            ) : (

                <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={styles.pageWrapper}
                >

                    <button
                        className={styles.btnBackIntro}
                        onClick={() => setShowForm(false)}
                    >
                        <ArrowLeft size={16} />
                        Back to intro
                    </button>

                    <div className={styles.mainCard}>

                        <div className={styles.sidebar}>

                            <div className={styles.stepInfo}>

                                <div className={styles.activeStep}>
                                    0{step}
                                </div>

                                <div className={styles.stepTotal}>
                                    <p>Current Phase</p>

                                    <span>
                                        {step === 1 && "Expertise"}
                                        {step === 2 && "Verification"}
                                        {step === 3 && "Complete"}
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className={styles.contentArea}>

                            <AnimatePresence mode="wait">

                                {step === 1 && (

                                    <StepExpertise
                                        formData={formData}
                                        updateData={updateFormData}
                                        onNext={() => setStep(2)}
                                    />

                                )}

                                {step === 2 && (

                                    <StepVerification
                                        formData={formData}
                                        updateData={updateFormData}
                                        onBack={() => setStep(1)}
                                        onSubmit={submitApplication}
                                        loading={loading}
                                    />

                                )}

                                {step === 3 && <SuccessState />}

                            </AnimatePresence>

                        </div>

                    </div>

                </motion.div>

            )}

        </AnimatePresence>

    </div>
);
};

export default ExpertApplicationPage;