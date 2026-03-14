import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, MapPin, Users, MoreVertical, Search } from 'lucide-react';
import styles from './MyEvents.module.scss';
import { PATHS } from '@/app/routes/paths';
import { useNavigate } from 'react-router-dom';

const MyEvents = () => {
    const navigate = useNavigate();
    const events = [
        {
            id: 1,
            title: "Autumn Fashion Workshop 2024",
            date: "Oct 24, 2024",
            location: "Le Jardin, Dist 1",
            attendees: 45,
            status: "Upcoming",
            image: "https://images.unsplash.com/photo-1523199455310-87b16c0ebe11?w=400&h=250&fit=crop"
        },
        {
            id: 2,
            title: "Personal Styling Masterclass",
            date: "Nov 02, 2024",
            location: "Online (Zoom)",
            attendees: 120,
            status: "Draft",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=250&fit=crop"
        }
    ];

    return (
        <div className={styles.container}>
            {/* HEADER SECTION */}
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>My Events</h1>
                    <p>Manage and track your fashion workshops or seminars.</p>
                </div>
                <button className={styles.btnCreate} onClick={() => navigate(PATHS.EXPERT_CREATE_EVENTS)}>
                    <Plus size={20} />
                    <span>Create New Event</span>
                </button>
            </header>

            {/* FILTER & SEARCH BAR */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input type="text" placeholder="Search events..." />
                </div>
                <div className={styles.filters}>
                    <button className={styles.activeFilter}>All</button>
                    <button>Upcoming</button>
                    <button>Past</button>
                </div>
            </div>

            {/* EVENTS GRID */}
            <div className={styles.eventGrid}>
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.eventCard}
                    >
                        <div className={styles.imageWrapper}>
                            <img src={event.image} alt={event.title} />
                            <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()]}`}>
                                {event.status}
                            </span>
                        </div>

                        <div className={styles.cardContent}>
                            <h3>{event.title}</h3>
                            <div className={styles.infoRow}>
                                <Calendar size={14} /> <span>{event.date}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <MapPin size={14} /> <span>{event.location}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <Users size={14} /> <span>{event.attendees} registered</span>
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <button className={styles.btnEdit}>Edit</button>
                            <button className={styles.btnMore}>
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MyEvents;