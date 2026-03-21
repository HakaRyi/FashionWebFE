import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import styles from "@/features/expert/styles/ExpertApplication.module.scss";

import {
    LandingSection,
    StepExpertise,
    StepVerification,
    SuccessState,
    useExpertApplication
} from "@/features/expert";

const ExpertApplicationPage = () => {

    const [showForm, setShowForm] = useState(false);

    const {
        step,
        setStep,
        loading,
        formData,
        updateFormData,
        submitApplication
    } = useExpertApplication();

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


// import React, { useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { ArrowLeft } from 'lucide-react';
// import styles from './ExpertApplication.module.scss';
// import { registerExpert } from '@/services/expertService';

// import LandingSection from '@/components/events/LandingSection';
// import StepExpertise from '@/components/events/StepExpertise';
// import StepVerification from '@/components/events/StepVerification';
// import SuccessState from '@/components/events/SuccessState';

// const ExpertApplication = () => {
//     const [showForm, setShowForm] = useState(false);
//     const [step, setStep] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         style: 'Stylist',
//         customStyle: '',
//         styleAesthetic: 'Minimalism',
//         customAesthetic: '',
//         yearsOfExperience: 1,
//         bio: '',
//         evidenceType: 'pdf',
//         portfolioUrl: '',
//         file: null,
//     });

//     const updateFormData = (newData) => {
//         setFormData(prev => ({ ...prev, ...newData }));
//     };

//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             const isOtherRole = formData.style === 'Other';
//             const isOtherAesthetic = formData.styleAesthetic === 'Other';

//             const finalPayload = {
//                 ...formData,
//                 style: isOtherRole ? formData.customStyle : formData.style,
//                 styleAesthetic: isOtherAesthetic ? formData.customAesthetic : formData.styleAesthetic,
//                 file: formData.file
//             };

//             await registerExpert(finalPayload);
//             setStep(3);
//         } catch (error) {
//             alert(error.response?.data || "Có lỗi xảy ra khi đăng ký.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className={styles.container}>
//             <AnimatePresence mode="wait">
//                 {!showForm ? (
//                     <LandingSection onStart={() => setShowForm(true)} />
//                 ) : (
//                     <motion.div
//                         key="form-container"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0 }}
//                         className={styles.pageWrapper}
//                     >
//                         <button className={styles.btnBackIntro} onClick={() => setShowForm(false)}>
//                             <ArrowLeft size={16} /> Quay lại giới thiệu
//                         </button>

//                         <div className={styles.mainCard}>
//                             {/* Sidebar tiến độ */}
//                             <div className={styles.sidebar}>
//                                 <div className={styles.stepInfo}>
//                                     <div className={styles.activeStep}>0{step}</div>
//                                     <div className={styles.stepTotal}>
//                                         <p>Current Phase</p>
//                                         <span>{step === 1 ? 'Expertise' : step === 2 ? 'Verification' : 'Complete'}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Nội dung Form */}
//                             <div className={styles.contentArea}>
//                                 <AnimatePresence mode="wait">
//                                     {step === 1 && (
//                                         <StepExpertise
//                                             formData={formData}
//                                             updateData={updateFormData}
//                                             onNext={() => setStep(2)}
//                                         />
//                                     )}
//                                     {step === 2 && (
//                                         <StepVerification
//                                             formData={formData}
//                                             updateData={updateFormData}
//                                             onBack={() => setStep(1)}
//                                             onSubmit={handleSubmit}
//                                             loading={loading}
//                                         />
//                                     )}
//                                     {step === 3 && <SuccessState />}
//                                 </AnimatePresence>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default ExpertApplication;