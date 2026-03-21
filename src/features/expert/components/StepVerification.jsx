import React from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, Globe, UploadCloud } from 'lucide-react';
import styles from '../styles/ExpertApplication.module.scss';

const StepVerification = ({ formData, updateData, onBack, onSubmit, loading }) => {
    return (
        <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
            <div className={styles.headerTitle}><Award color="#c5a059" size={18} /> <span>Evidence of Talent</span></div>

            <div className={styles.tabSelector}>
                <button className={formData.evidenceType === 'pdf' ? styles.activeTab : ''} onClick={() => updateData({ evidenceType: 'pdf' })}><FileText size={14} /> PDF Portfolio</button>
                <button className={formData.evidenceType === 'link' ? styles.activeTab : ''} onClick={() => updateData({ evidenceType: 'link' })}><Globe size={14} /> External Link</button>
            </div>

            {formData.evidenceType === 'pdf' ? (
                <div className={styles.uploadZone}>
                    <UploadCloud size={40} />
                    <h4>{formData.file ? formData.file.name : "Click to upload Portfolio"}</h4>
                    <input type="file" id="pdfUpload" hidden accept=".pdf" onChange={(e) => updateData({ file: e.target.files[0] })} />
                    <label htmlFor="pdfUpload" className={styles.uploadBtn}>Choose File</label>
                </div>
            ) : (
                <div className={styles.inputWrapper}>
                    <label>Portfolio URL</label>
                    <input type="url" placeholder="https://behance.net/yourname" value={formData.portfolioUrl} onChange={(e) => updateData({ portfolioUrl: e.target.value })} />
                </div>
            )}

            <div className={styles.inputWrapper}>
                <label>Bio / Philosophy</label>
                <textarea rows="3" placeholder="Chia sẻ góc nhìn thời trang của bạn..." value={formData.bio} onChange={(e) => updateData({ bio: e.target.value })} />
            </div>

            <div className={styles.btnGroup}>
                <button className={styles.btnSecondary} onClick={onBack}>Back</button>
                <button className={styles.btnPrimary} onClick={onSubmit} disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                </button>
            </div>
        </motion.div>
    );
};

export default StepVerification;