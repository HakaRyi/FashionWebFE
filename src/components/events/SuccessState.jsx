import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from '../../pages/ExpertApplication/ExpertApplication.module.scss';

const SuccessState = () => (
    <motion.div key="s3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={styles.successState}>
        <div className={styles.successIcon}><Check size={40} /></div>
        <h2>Application Sent!</h2>
        <p>Cảm ơn bạn! Hồ sơ của bạn đang được hội đồng chuyên môn Vogue xét duyệt trong vòng 24-48h tới.</p>
        <button className={styles.btnPrimary} onClick={() => window.location.href = '/'}>Return to Home</button>
    </motion.div>
);

export default SuccessState;