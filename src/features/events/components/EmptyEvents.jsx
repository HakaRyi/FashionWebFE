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
                    <h2>No grading schedule has been set yet.</h2>
                    <p>You are not currently participating in any event judging panels.</p>
                </>
            ) : (
                <>
                    <h2>No events available.</h2>
                    <p>Get started by creating your first event today!</p>
                    <button className={styles.btnCreateLarge} onClick={onCreate}>
                        Create New Event
                    </button>
                </>
            )}
        </motion.div>
    );
};

export default EmptyEvents;