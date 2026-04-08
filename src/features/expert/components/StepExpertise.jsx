import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Briefcase, ArrowRight, Edit3 } from 'lucide-react';
import styles from '../styles/ExpertApplication.module.scss';

const FASHION_STYLES = [
    { id: 'Stylist', label: 'Fashion Stylist' },
    { id: 'Designer', label: 'Fashion Designer' },
    { id: 'Model', label: 'Fashion Model' },
    { id: 'Influencer', label: 'Fashion Influencer' },
    { id: 'Other', label: 'Other Role' },
];

const PRESET_AESTHETICS = ['Minimalism', 'Vintage', 'Streetwear', 'Avant-Garde', 'Bohemian', 'Quiet Luxury', 'Y2K'];

const StepExpertise = ({ formData, updateData, onNext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    // Lấy label hiển thị cho Role dựa trên ID lưu trong formData
    const currentStyle = FASHION_STYLES.find(s => s.id === formData.style) || FASHION_STYLES[0];

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Xử lý chọn Aesthetic
    const handleAestheticClick = (item) => {
        if (item === 'Other') {
            updateData({ isOtherAesthetic: true });
        } else {
            updateData({ isOtherAesthetic: false, styleAesthetic: item });
        }
    };

    return (
        <motion.div 
            key="s1" 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -20, opacity: 0 }}
        >
            <div className={styles.headerTitle}>
                <Sparkles color="#c5a059" size={18} /> 
                <span>Expertise Details</span>
            </div>

            {/* --- PHẦN 1: EXPERT ROLE --- */}
            <div className={styles.inputWrapper} ref={selectRef}>
                <label>Expert Role</label>
                <div className={styles.customSelect}>
                    <div 
                        className={`${styles.selectTrigger} ${isOpen ? styles.active : ''}`} 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>{currentStyle.label}</span>
                        <ChevronDown size={16} className={`${styles.arrow} ${isOpen ? styles.rotate : ''}`} />
                    </div>
                    
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={styles.selectMenu}
                            >
                                {FASHION_STYLES.map((s) => (
                                    <div 
                                        key={s.id} 
                                        className={`${styles.option} ${formData.style === s.id ? styles.selected : ''}`} 
                                        onClick={() => { 
                                            updateData({ style: s.id }); 
                                            setIsOpen(false); 
                                        }}
                                    >
                                        {s.label}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Ô nhập liệu nếu chọn Other Role */}
                <AnimatePresence>
                    {formData.style === 'Other' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1, marginTop: 12 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className={styles.subInputContainer}
                        >
                            <div className={styles.iconInput}>
                                <Edit3 size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Specify your professional role..." 
                                    value={formData.customStyle || ''} 
                                    onChange={(e) => updateData({ customStyle: e.target.value })}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- PHẦN 2: FASHION AESTHETIC --- */}
            <div className={styles.inputWrapper}>
                <label>Fashion Aesthetic</label>
                <div className={styles.aestheticGrid}>
                    {PRESET_AESTHETICS.map(item => (
                        <button
                            key={item}
                            type="button"
                            className={`${styles.aestheticTag} ${(!formData.isOtherAesthetic && formData.styleAesthetic === item) ? styles.activeTag : ''}`}
                            onClick={() => handleAestheticClick(item)}
                        >
                            {item}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`${styles.aestheticTag} ${formData.isOtherAesthetic ? styles.activeTag : ''}`}
                        onClick={() => handleAestheticClick('Other')}
                    >
                        Other
                    </button>
                </div>

                {/* Ô nhập liệu nếu chọn Other Aesthetic */}
                <AnimatePresence>
                    {formData.isOtherAesthetic && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1, marginTop: 12 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className={styles.subInputContainer}
                        >
                            <div className={styles.iconInput}>
                                <Edit3 size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Enter your specific aesthetic (e.g. Cyberpunk)..." 
                                    value={formData.customAesthetic || ''} 
                                    onChange={(e) => updateData({ customAesthetic: e.target.value })}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- PHẦN 3: YEARS OF EXPERIENCE --- */}
            <div className={styles.inputWrapper}>
                <label>Years of Experience</label>
                <div className={styles.iconInput}>
                    <Briefcase size={16} />
                    <input 
                        type="number" 
                        min="1" 
                        max="50"
                        value={formData.yearsOfExperience} 
                        onChange={(e) => updateData({ yearsOfExperience: e.target.value })} 
                    />
                </div>
            </div>

            <div className={styles.btnGroup}>
                <button 
                    className={styles.btnPrimary} 
                    onClick={onNext}
                    disabled={formData.style === 'Other' && !formData.customStyle}
                >
                    Next: Verification <ArrowRight size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default StepExpertise;