import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/app/routes/paths";
import styles from '../styles/ExpertApplication.module.scss';

const SuccessState = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            key="s3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={styles.successState}
        >
            <div className={styles.successIcon}>
                <Check size={40} />
            </div>
            <h2>Application Sent!</h2>
            <p>
                Thank you! Your application is currently being reviewed by the WAPO expert panel and will be available within the next 24-48 hours.
            </p>
            <button
                className={styles.btnPrimary}
                onClick={() => navigate(PATHS.USER_FEED)}
            >
                Return to Home
            </button>
        </motion.div>
    );
};

export default SuccessState;