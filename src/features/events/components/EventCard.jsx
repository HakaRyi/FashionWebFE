import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, MoreVertical } from "lucide-react";
import styles from "../styles/MyEvents.module.scss";

const EventCard = ({ event, index, onClick }) => {
    return (
        <motion.div
            key={event.eventId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={styles.eventCard}
            onClick={onClick}
        >
            <div className={styles.imageWrapper}>
                <img
                    src={
                        event.images?.[0]?.imageUrl ||
                        "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={event.title}
                />

                <span
                    className={`${styles.statusBadge} ${
                        styles[event.status?.toLowerCase()]
                    }`}
                >
                    {event.status}
                </span>
            </div>

            <div className={styles.cardContent}>
                <h3>{event.title}</h3>

                <div className={styles.infoRow}>
                    <Calendar size={14} />
                    <span>
                        {new Date(event.startTime).toLocaleDateString()}
                    </span>
                </div>

                <div className={styles.infoRow}>
                    <MapPin size={14} />
                    <span>Expert Studio</span>
                </div>

                <div className={styles.infoRow}>
                    <Users size={14} />
                    <span>{event.posts?.length || 0} Submissions</span>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <button className={styles.btnEdit}>Manage</button>

                <button
                    className={styles.btnMore}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical size={18} />
                </button>
            </div>
        </motion.div>
    );
};

export default EventCard;