import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    ArrowLeft,
    Check,
    UploadCloud,
    Instagram,
    Globe,
    Sparkles,
    Award,
    FileText,
    ChevronDown,
} from 'lucide-react';
import styles from './ExpertApplication.module.scss';

const FASHION_STYLES = [
    {
        id: 'min',
        label: 'Minimalism / Old Money',
        img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=500',
    },
    { id: 'street', label: 'Streetwear / Y2K', img: 'https://m.yodycdn.com/blog/streetwear-la-gi-yody-vn-21.jpg' },
    {
        id: 'vint',
        label: 'Vintage / Retro',
        img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500',
    },
    {
        id: 'avant',
        label: 'Avant-Garde / High-Fashion',
        img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500',
    },
];

const ExpertApplication = () => {
    const [step, setStep] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [evidenceType, setEvidenceType] = useState('pdf');
    const selectRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        style: 'min',
        social: '',
        bio: '',
        evidence: null,
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
    const currentStyle = FASHION_STYLES.find((s) => s.id === formData.style);

    return (
        <div className={styles.pageWrapper}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={styles.mainCard}>
                <div className={styles.sidebar}>
                    <div className={styles.brandZone}>
                        <div className={styles.logoCircle}>F</div>
                        <div>
                            <p className="text-[#c5a059] tracking-[5px] text-[10px] font-bold uppercase">
                                Fashion Elite
                            </p>
                            <h3 className="font-serif text-xl italic">Curating Excellence</h3>
                        </div>
                    </div>

                    <div className={styles.heroText}>
                        <h2>
                            Redefine <br /> The Standard.
                        </h2>
                        <p className="text-gray-400 text-sm mt-4 font-light leading-relaxed">
                            Let the world admire your unique fashion identity.
                        </p>
                    </div>

                    <div className={styles.stepInfo}>
                        <div className={styles.activeStep}>0{step}</div>
                        <div className={styles.stepTotal}>
                            <p>Current Phase:</p>
                            <span>{step === 1 ? 'Personal Identity' : step === 2 ? 'Verification' : 'Complete'}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.contentArea}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                            >
                                <div className={styles.headerTitle}>
                                    <Sparkles className="text-[#c5a059]" size={18} />
                                    <span>Personal Identity</span>
                                </div>

                                <div className={styles.inputWrapper}>
                                    <label>Expert Display Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Alexander Vang"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className={styles.inputWrapper} ref={selectRef}>
                                    <label>Signature Style</label>
                                    <div className={styles.customSelect}>
                                        <div
                                            className={`${styles.selectTrigger} ${isOpen ? styles.active : ''}`}
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <div className={styles.selectedContent}>
                                                <img src={currentStyle.img} alt="" className={styles.miniThumb} />
                                                <span>{currentStyle.label}</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`${styles.arrow} ${isOpen ? styles.rotate : ''}`}
                                            />
                                        </div>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className={styles.selectMenu}
                                                >
                                                    {FASHION_STYLES.map((style) => (
                                                        <div
                                                            key={style.id}
                                                            className={`${styles.selectOption} ${formData.style === style.id ? styles.selected : ''}`}
                                                            onClick={() => {
                                                                setFormData({ ...formData, style: style.id });
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            <div className={styles.optionInfo}>
                                                                <img
                                                                    src={style.img}
                                                                    alt=""
                                                                    className={styles.optionThumb}
                                                                />
                                                                <span>{style.label}</span>
                                                            </div>
                                                            {formData.style === style.id && (
                                                                <Check size={14} className={styles.checkIcon} />
                                                            )}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className={styles.inputWrapper + ' mt-8'}>
                                    <label>Social Influence (Instagram/TikTok)</label>
                                    <div className={styles.iconInput}>
                                        <Instagram size={16} />
                                        <input
                                            type="text"
                                            placeholder="@yourhandle (Optional)"
                                            value={formData.social}
                                            onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button className={styles.btnPrimary} onClick={nextStep}>
                                    Begin Verification <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                            >
                                <div className={styles.headerTitle}>
                                    <Award className="text-[#c5a059]" size={18} />
                                    <span>Evidence of Talent</span>
                                </div>

                                <div className={styles.tabSelector}>
                                    <button
                                        className={evidenceType === 'pdf' ? styles.activeTab : ''}
                                        onClick={() => setEvidenceType('pdf')}
                                    >
                                        <FileText size={14} /> PDF Portfolio
                                    </button>
                                    <button
                                        className={evidenceType === 'link' ? styles.activeTab : ''}
                                        onClick={() => setEvidenceType('link')}
                                    >
                                        <Globe size={14} /> External Link
                                    </button>
                                </div>

                                <div className={styles.evidenceContent}>
                                    <AnimatePresence mode="wait">
                                        {evidenceType === 'pdf' ? (
                                            <motion.div
                                                key="pdf"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className={styles.uploadZone}
                                            >
                                                <UploadCloud className={styles.uploadIcon} size={40} />
                                                <h4>Lookbook / Portfolio</h4>
                                                <p>Drag and drop your PDF here (Max 25MB)</p>
                                                <input type="file" id="pdfUpload" hidden />
                                                <label htmlFor="pdfUpload" className={styles.uploadBtn}>
                                                    Select File
                                                </label>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="link"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className={styles.inputWrapper}
                                            >
                                                <label>Personal Website / Behance Link</label>
                                                <div className={styles.iconInput}>
                                                    <Globe size={16} />
                                                    <input type="url" placeholder="https://behance.net/..." />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className={styles.bioSection}>
                                    <div className={styles.inputWrapper}>
                                        <label>Expert Bio / Philosophy</label>
                                        <textarea
                                            rows="3"
                                            placeholder="What is your fashion philosophy?"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.btnGroup}>
                                    <button className={styles.btnSecondary} onClick={prevStep}>
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <button className={styles.btnPrimary} onClick={nextStep}>
                                        Submit Application <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={styles.successState}
                            >
                                <div className={styles.glowCircle}>
                                    <Check className={styles.checkIcon} size={40} />
                                </div>
                                <h3 className="font-serif text-3xl mb-4 italic">Elegance in Review.</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
                                    Your expert profile is currently under review by our evaluation team. We will respond to you as soon as possible.
                                </p>
                                <button className={styles.btnGold} onClick={() => (window.location.href = '/')}>
                                    Back to Studio
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ExpertApplication;
