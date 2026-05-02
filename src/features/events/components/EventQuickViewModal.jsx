import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Trophy, Calendar, ArrowRight, CheckCircle, Clock, Ticket } from 'lucide-react';
import styles from '../styles/EventQuickViewModal.module.scss';
import { useNavigate } from 'react-router-dom';
import { PATHS } from "@/app/routes/paths";
import { useEventStore } from '../store/useEventStore';

const EventQuickViewModal = ({ isOpen, onClose, event, onJoinClick, user }) => {
    const navigate = useNavigate();

    const { fetchEventDetail, currentEvent, isLoading } = useEventStore();

    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = originalStyle; };
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && event?.eventId) {
            fetchEventDetail(event.eventId);
        }
    }, [isOpen, event?.eventId, fetchEventDetail]);

    const eventStatus = useMemo(() => {
        const activeData = (currentEvent?.eventId === event?.eventId) ? currentEvent : event;

        if (!activeData || !user) return null;

        const now = new Date();
        const start = new Date(activeData.startTime);
        const deadline = new Date(activeData.submissionDeadline);
        const end = new Date(activeData.endTime);

        let timing = { label: 'End:', date: end };
        if (now < start) timing = { label: 'Start:', date: start };
        else if (now < deadline) timing = { label: 'Submission Deadline:', date: deadline };

        const isCreator = user.userId === activeData.creatorId;
        const isJudge = activeData.experts?.some(
            exp => exp.expertId === user.userId && exp.status === 'Accepted'
        ) || false;

        const canJoin = activeData.status === 'Active' &&
            now < deadline &&
            !isCreator &&
            !isJudge;

        return { timing, canJoin, isCreator, isJudge };
    }, [event, currentEvent, user]);

    if (!event || !eventStatus) return null;

    const { timing, canJoin, isCreator, isJudge } = eventStatus;

    const handleViewDetail = () => {
        navigate(PATHS.EVENT_DETAIL.replace(':id', event.eventId));
        onClose();
    };

    const handleViewSummary = () => {
        navigate(`${PATHS.EVENT_SUMMARY.replace(':id', event.eventId)}?tab=summary`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.modalOverlay} onClick={onClose}>
                    <motion.div
                        className={styles.modalContainer}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Banner Image */}
                        <div className={styles.banner}>
                            <img src={event.thumbnailUrl} alt={event.title} />
                            <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                            <div className={styles.statusBadge}>{event.status}</div>
                        </div>

                        <div className={styles.content}>
                            <h2 className={styles.title}>{event.title}</h2>

                            <div className={styles.metaGrid}>
                                <div className={`${styles.metaItem} ${event.entryFee > 0 ? styles.feePaid : styles.feeFree}`}>
                                    <Ticket size={18} />
                                    <span>
                                        {event.entryFee > 0
                                            ? `${event.entryFee.toLocaleString('vi-VN')} VND`
                                            : 'Free Entry'}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <Users size={18} />
                                    <span>{event.participantCount} Participants</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <Trophy size={18} />
                                    <span>{event.totalPrizePool.toLocaleString('vi-VN')} VND</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <Calendar size={18} />
                                    <span>{timing.label} {timing.date.toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                            </div>

                            <p className={styles.description}>
                                {event.description?.substring(0, 160)}...
                            </p>

                            <div className={styles.actions}>
                                <button
                                    className={styles.detailBtn}
                                    onClick={handleViewDetail}
                                >
                                    View Details
                                    <ArrowRight size={18} />
                                </button>

                                {isLoading ? (
                                    <button className={styles.disabledBtn} disabled>Checking status...</button>
                                ) : (
                                    <>
                                        {event.status === 'Completed' ? (
                                            <button className={styles.summaryBtn} onClick={handleViewSummary}>
                                                <Trophy size={18} /> View Results
                                            </button>
                                        ) : event.isJoined ? (
                                            <button className={styles.alreadyJoinedBtn} disabled>
                                                <CheckCircle size={18} /> Already Joined
                                            </button>
                                        ) : isCreator ? (
                                            <button className={styles.disabledBtn} disabled>
                                                <Users size={18} /> You are the Creator
                                            </button>
                                        ) : isJudge ? (
                                            <button className={styles.disabledBtn} disabled>
                                                <Trophy size={18} /> You are a Judge
                                            </button>
                                        ) : canJoin ? (
                                            <button className={styles.joinBtn} onClick={() => onJoinClick(event)}>
                                                Join Event Now
                                            </button>
                                        ) : (
                                            <button className={styles.disabledBtn} disabled>
                                                <Clock size={18} />
                                                {event.status !== 'Active' ? 'Event Closed' : 'Deadline Passed'}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EventQuickViewModal;