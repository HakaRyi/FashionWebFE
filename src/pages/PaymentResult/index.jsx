import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, Wallet } from "lucide-react";
import { PATHS } from "@/app/routes/paths";
import styles from "./PaymentResult.module.scss"; // Bạn tự tạo file CSS/SCSS nhé

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");
    const isSuccess = status === "00";

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                navigate(PATHS.EXPERT_CREATE_EVENTS);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

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
                    {isSuccess ? "Nạp tiền thành công!" : "Giao dịch thất bại"}
                </h1>

                <div className={styles.details}>
                    <p>Mã đơn hàng: <strong>{orderCode}</strong></p>
                    {isSuccess ? (
                        <p>Số dư ví của bạn đã được cập nhật. Hãy quay lại để hoàn tất sự kiện.</p>
                    ) : (
                        <p>Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.</p>
                    )}
                </div>

                <div className={styles.actions}>
                    <button 
                        onClick={() => navigate(PATHS.CREATE_EVENT)} 
                        className={styles.btnMain}
                    >
                        {isSuccess ? "Tiếp tục tạo sự kiện" : "Quay lại thử lại"} 
                        <ArrowRight size={18} />
                    </button>
                    
                    <button 
                        onClick={() => navigate(PATHS.DASHBOARD)} 
                        className={styles.btnSub}
                    >
                        Về trang chủ
                    </button>
                </div>

                {isSuccess && (
                    <div className={styles.footerNote}>
                        Tự động quay lại sau 5 giây...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;