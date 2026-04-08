import React from "react";
import { motion } from "framer-motion";
import { CalendarOff, Inbox } from "lucide-react";
import styles from "../styles/EmptyEvents.module.scss";

const EmptyEvents = ({ onCreate, isJudging }) => {
    return (
        <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className={styles.emptyIcon}>
                {isJudging ? <Inbox size={48} /> : <CalendarOff size={48} />}
            </div>

            {isJudging ? (
                <>
                    <h2>Chưa có lịch chấm điểm</h2>
                    <p>Bạn hiện không tham gia hội đồng chuyên gia của sự kiện nào.</p>
                </>
            ) : (
                <>
                    <h2>Chưa có sự kiện nào</h2>
                    <p>Hãy bắt đầu tạo workshop đầu tiên của bạn ngay hôm nay!</p>
                    <button className={styles.btnCreateLarge} onClick={onCreate}>
                        Tạo sự kiện mới
                    </button>
                </>
            )}
        </motion.div>
    );
};

export default EmptyEvents;