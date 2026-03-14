import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, Plus, Briefcase, ArrowRight } from 'lucide-react';
import styles from '../../pages/ExpertApplication/ExpertApplication.module.scss';

const FASHION_STYLES = [
    { id: 'Stylist', label: 'Fashion Stylist', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=500' },
    { id: 'Designer', label: 'Fashion Designer', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=500' },
    { id: 'Model', label: 'Fashion Model', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500' },
    { id: 'Influencer', label: 'Fashion Influencer', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500' },
];

const PRESET_AESTHETICS = ['Minimalism', 'Vintage', 'Streetwear', 'Avant-Garde', 'Bohemian', 'Quiet Luxury', 'Y2K'];

const StepExpertise = ({ formData, updateData, onNext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    const currentStyle = FASHION_STYLES.find(s => s.id === formData.style) || FASHION_STYLES[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
            <div className={styles.headerTitle}><Sparkles color="#c5a059" size={18} /> <span>Expertise Details</span></div>

            <div className={styles.inputWrapper} ref={selectRef}>
                <label>Expert Role</label>
                <div className={styles.customSelect}>
                    <div className={`${styles.selectTrigger} ${isOpen ? styles.active : ''}`} onClick={() => setIsOpen(!isOpen)}>
                        <div className={styles.selectedContent}>
                            <img src={currentStyle.img} alt="" className={styles.miniThumb} />
                            <span>{currentStyle.label}</span>
                        </div>
                        <ChevronDown size={16} className={`${styles.arrow} ${isOpen ? styles.rotate : ''}`} />
                    </div>
                    {isOpen && (
                        <div className={styles.selectMenu}>
                            {FASHION_STYLES.map((s) => (
                                <div key={s.id} className={styles.option} onClick={() => { updateData({ style: s.id }); setIsOpen(false); }}>
                                    <img src={s.img} alt="" /> <span>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.inputWrapper}>
                <label>Fashion Aesthetic</label>
                <div className={styles.aestheticGrid}>
                    {PRESET_AESTHETICS.map(item => (
                        <button
                            key={item}
                            className={`${styles.aestheticTag} ${formData.styleAesthetic === item ? styles.activeTag : ''}`}
                            onClick={() => updateData({ styleAesthetic: item })}
                        >
                            {item}
                        </button>
                    ))}
                    <button
                        className={`${styles.aestheticTag} ${formData.styleAesthetic === 'Other' ? styles.activeTag : ''}`}
                        onClick={() => updateData({ styleAesthetic: 'Other' })}
                    >
                        <Plus size={14} /> Other
                    </button>
                </div>
            </div>

            <div className={styles.inputWrapper}>
                <label>Years of Experience</label>
                <div className={styles.iconInput}>
                    <Briefcase size={16} />
                    <input type="number" min="1" value={formData.yearsOfExperience} onChange={(e) => updateData({ yearsOfExperience: e.target.value })} />
                </div>
            </div>

            <div className={styles.btnGroup}>
                <button className={styles.btnPrimary} onClick={onNext}>
                    Next: Verification <ArrowRight size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default StepExpertise;