import React from "react";
import { motion } from "framer-motion";
import { CalendarOff } from "lucide-react";
import styles from "../styles/EmptyEvents.module.scss";

const EmptyEvents = ({ onCreate }) => {
    return (
        <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className={styles.emptyIcon}>
                <CalendarOff size={48} />
            </div>

            <h2>No events found</h2>
            <p>You haven't created any events yet.</p>

            <button className={styles.btnCreateLarge} onClick={onCreate}>
                Create Your First Event
            </button>
        </motion.div>
    );
};

export default EmptyEvents;