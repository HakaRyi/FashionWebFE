import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import styles from './Unauthorized.module.scss';

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        // Quay lại trang trước đó hoặc về dashboard nếu không có lịch sử
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <ShieldAlert size={80} strokeWidth={1} />
                </div>
                <h1 className={styles.title}>Access Denied</h1>
                <p className={styles.message}>
                    You do not have the necessary permissions to view this luxury collection. 
                    Please contact your administrator if you believe this is an error.
                </p>
                <button className={styles.backButton} onClick={handleGoBack}>
                    <ArrowLeft size={18} />
                    <span>Return to Elegance</span>
                </button>
            </div>
            <div className={styles.footer}>
                © 2026 Vogue & Elegance Management System
            </div>
        </div>
    );
};

export default Unauthorized;