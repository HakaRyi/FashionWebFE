import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, Wallet } from "lucide-react";
import { PATHS } from "@/app/routes/paths";
import styles from "./PaymentResult.module.scss";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");
    const isSuccess = status === "00";

    const returnPath = sessionStorage.getItem("post_payment_url") || PATHS.USER_FEED;

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                handleBack();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const handleBack = () => {
        sessionStorage.removeItem("post_payment_url");
        navigate(returnPath);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconSection}>
                    {isSuccess ? (
                        <CheckCircle2 size={80} color="#2ecc71" className={styles.animatePop} />
                    ) : (
                        <XCircle size={80} color="#e74c3c" />
                    )}
                </div>

                <h1 className={isSuccess ? styles.successText : styles.errorText}>
                    {isSuccess ? "Deposit successful!" : "Deposit failed"}
                </h1>

                <div className={styles.details}>
                    <p>Order Code: <strong>{orderCode}</strong></p>
                    {isSuccess ? (
                        <p>Your wallet balance has been updated.</p>
                    ) : (
                        <p>An error occurred during the payment process. Please try again later.</p>
                    )}
                </div>

                <div className={styles.actions}>
                    <button onClick={handleBack} className={styles.btnMain}>
                        {isSuccess ? "Continue working" : "Go back and try again"}
                        <ArrowRight size={18} />
                    </button>

                    <button onClick={() => navigate(PATHS.USER_FEED)} className={styles.btnSub}>
                        Back to Home
                    </button>
                </div>

                {isSuccess && (
                    <div className={styles.footerNote}>
                        Automatically redirecting in 5 seconds...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;