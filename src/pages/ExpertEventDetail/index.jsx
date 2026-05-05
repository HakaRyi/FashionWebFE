import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft, Landmark, PlayCircle, XCircle, Clock, ShieldCheck, Info
} from "lucide-react";
import {
    useEventDetail, PrizeSection, PostTable, getEventStatusInfo,
    getExpertStatusInfo, PostDetailModal
} from "@/features/events";
import { motion, AnimatePresence } from "motion/react";
import styles from "./EventDetail.module.scss";
import { PATHS } from '@/app/routes/paths';

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        event, posts, loading, isFinalizing, handleFinalize,
        isStarting, handleManualStart, isCancelling, handleCancel
    } = useEventDetail(id);

    const [selectedPost, setSelectedPost] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    const handleNavigateDetail = (post) => {
        navigate(PATHS.POST_DETAIL.replace(':id', post.postId));
    };

    // Logic Countdown
    useEffect(() => {
        if (!event?.submissionDeadline || event.status !== "Active") return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(event.submissionDeadline).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft(null);
            } else {
                setTimeLeft({
                    d: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
                    h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
                    m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
                    s: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0'),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [event?.submissionDeadline, event?.status]);

    // Tính toán phần trăm tiến độ
    const progressPercent = useMemo(() => {
        if (!event) return 0;
        const start = new Date(event.startTime).getTime();
        const end = new Date(event.endTime).getTime();
        const now = new Date().getTime();
        if (now < start) return 0;
        if (now > end) return 100;
        return ((now - start) / (end - start)) * 100;
    }, [event]);

    const expertsList = useMemo(() => {
        if (!event) return [];

        // 2. Sử dụng optional chaining để an toàn tuyệt đối
        const filteredExperts = (event.experts || [])
            .filter(ex => {
                const isAccepted = event.isCreator ? true : ex.status === "Accepted";

                const isNotCreator = ex.expertId !== event.creatorId;

                return isAccepted && isNotCreator;
            })
            .map(ex => ({
                ...ex,
                displayAvatar: ex.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(ex.fullName)}&background=random&color=fff`
            }));

        const creatorCard = {
            isCreator: true,
            id: 'creator',
            name: event.creatorName,
            displayAvatar: event.creatorAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.creatorName)}&background=random&color=fff`,
            role: "Lead Organizer",
            expertise: "Organizer"
        };

        const midIndex = Math.floor(filteredExperts.length / 2);
        const combined = [...filteredExperts];
        combined.splice(midIndex, 0, creatorCard);

        return combined;
    }, [event]);

    if (loading && !event) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinnerWrapper}>
                <div className={styles.spinner} />
                <p>Initializing Environment</p>
            </div>
        </div>
    );

    if (!event) return (
        <div className={styles.errorScreen}>
            <h1>Transmission Lost</h1>
            <button onClick={() => navigate('/')}>Relocate</button>
        </div>
    );

    const eventStatus = getEventStatusInfo(event.status);

    return (
        <div className={styles.pageContainer}>
            {/* --- STICKY NAV --- */}
            <nav className={styles.stickyNav}>
                <button className={styles.btnBack} onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} /> <span>Back</span>
                </button>

                <div className={styles.navActions}>
                    {event.isCreator && (
                        <>
                            {(event.status === "Inviting" || event.status === "Pending_Review") && (
                                <>
                                    {event.status === "Inviting" && (
                                        <button
                                            className={styles.btnStart}
                                            onClick={handleManualStart}
                                            disabled={isStarting || event.isAutoStart || !event.canManualStart}
                                        >
                                            <PlayCircle size={18} />
                                            {isStarting ? "Processing" : "Start Now"}
                                        </button>
                                    )}
                                    <button
                                        className={styles.btnCancel}
                                        onClick={handleCancel}
                                        disabled={isCancelling}
                                    >
                                        <XCircle size={18} /> {isCancelling ? "..." : "Cancel"}
                                    </button>
                                </>
                            )}
                            {event.status !== "Completed" && event.canFinalize && (
                                <button
                                    className={styles.btnFinalize}
                                    onClick={handleFinalize}
                                    disabled={isFinalizing}
                                >
                                    <Landmark size={18} /> {isFinalizing ? "..." : "Finalize & Disburse"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {/* --- HERO --- */}
            <header className={styles.hero}>
                <div
                    className={styles.heroBg}
                    style={{ backgroundImage: `url(${event.thumbnailUrl})` }}
                />
                <div className={styles.heroContent}>
                    <div className={styles.heroMeta}>
                        <div className={styles.metaLeft}>
                            <span className={`${styles.statusBadge} ${styles[eventStatus.variant]}`}>
                                {eventStatus.label}
                            </span>

                            <div className={`${styles.feeInfo} ${event.entryFee === 0 ? styles.isFree : styles.isPaid}`}>
                                {event.entryFee > 0 ? (
                                    <>
                                        <span className={styles.feeLabel}>Entry Fee</span>
                                        <span className={styles.feeValue}>
                                            {event.entryFee.toLocaleString('vi-VN')} <small>VND</small>
                                        </span>
                                    </>
                                ) : (
                                    <span className={styles.freeText}>Complimentary</span>
                                )}
                            </div>
                        </div>

                        {event.status === "Active" && timeLeft && (
                            <div className={styles.countdownWrapper}>
                                <span className={styles.countdownLabel}>
                                    {new Date() < new Date(event.submissionDeadline)
                                        ? "Time to Join"
                                        : "Event Closing"}
                                </span>
                                <div className={styles.countdown}>
                                    {[
                                        { val: timeLeft.d, label: 'Day' },
                                        { val: timeLeft.h, label: 'Hour' },
                                        { val: timeLeft.m, label: 'Min' },
                                        { val: timeLeft.s, label: 'Sec' }
                                    ].map((unit, i) => (
                                        <React.Fragment key={unit.label}>
                                            <div className={styles.timeUnit}>
                                                <span className={styles.timeVal}>{unit.val}</span>
                                                <span className={styles.timeLabel}>{unit.label}</span>
                                            </div>
                                            {i < 3 && <div className={styles.timeDivider}>:</div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <h1 className={styles.heroTitle}>{event.title}</h1>
                </div>
            </header>

            <main className={styles.mainWrapper}>
                {/* REJECTED ALERT */}
                {event.status === "Rejected" && event.isCreator && (
                    <div className={styles.rejectAlert}>
                        <XCircle size={24} />
                        <div>
                            <strong>Event Rejected</strong>
                            <p>{event.reasonRejectEvent || "No specific reason provided."}</p>
                        </div>
                    </div>
                )}

                {/* ROADMAP & SCORING GRID */}
                <div className={styles.statsGrid}>
                    {/* ROADMAP */}
                    <section className={styles.statsCard}>
                        <div className={styles.cardHeader}>
                            <Clock size={16} /> Roadmap Timeline
                        </div>
                        <div className={styles.timelineVisual}>
                            <div className={styles.baseLine} />
                            <motion.div
                                className={styles.progressLine}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1 }}
                            />
                            <div className={styles.milestones}>
                                {[
                                    { label: "Begin", date: event.startTime },
                                    { label: "Deadline", date: event.submissionDeadline },
                                    { label: "End", date: event.endTime }
                                ].map((m, idx) => {
                                    const isReached = new Date() >= new Date(m.date);
                                    return (
                                        <div key={idx} className={`${styles.milestone} ${isReached ? styles.reached : ''}`}>
                                            <div className={styles.dot} />
                                            <div className={styles.msLabel}>{m.label}</div>
                                            <div className={styles.msDate}>
                                                {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* SCORING CHART */}
                    <section className={styles.statsCard}>
                        <div className={styles.cardHeader}>
                            <ShieldCheck size={16} /> Scoring Weightage
                        </div>
                        <div className={styles.scoringBody}>
                            <div className={styles.chartArea}>
                                <svg viewBox="0 0 36 36" className={styles.svgCircle}>
                                    <circle cx="18" cy="18" r="15.9" className={styles.circleBg} />
                                    <motion.circle
                                        cx="18" cy="18" r="15.9"
                                        className={styles.circleActive}
                                        initial={{ strokeDasharray: "0 100" }}
                                        animate={{ strokeDasharray: `${event.expertWeight * 100} 100` }}
                                        transition={{ duration: 1.5 }}
                                    />
                                </svg>
                                <div className={styles.chartText}>
                                    <span className={styles.ratioNum}>{Math.round(event.expertWeight * 100)}/{Math.round(event.userWeight * 100)}</span>
                                    <span className={styles.ratioSub}>Ratio</span>
                                </div>
                            </div>
                            <div className={styles.chartLegend}>
                                <div className={styles.legendItem}>
                                    <i className={styles.dotExpert} />
                                    <div>
                                        <strong>Expert ({Math.round(event.expertWeight * 100)}%)</strong>
                                        <p>Technical & creative</p>
                                    </div>
                                </div>
                                <div className={styles.legendItem}>
                                    <i className={styles.dotUser} />
                                    <div>
                                        <strong>Community ({Math.round(event.userWeight * 100)}%)</strong>
                                        <p>Public voting</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {event.criteria && event.criteria.length > 0 && (
                    <section className={styles.contentSection}>
                        <div className={styles.sectionHeaderInline}>
                            <h3 className={styles.sectionTitle}>Judging Criteria Structure</h3>
                            <div className={styles.totalWeightBadge}>Total 100%</div>
                        </div>

                        {/* Thanh dài tổng thể */}
                        <div className={styles.criteriaMainBar}>
                            {event.criteria.map((c, idx) => (
                                <div
                                    key={idx}
                                    className={styles.barSegment}
                                    style={{
                                        width: `${c.weightPercentage}%`,
                                        '--segment-index': idx // Để dùng trong CSS tạo màu ngẫu nhiên
                                    }}
                                    title={`${c.name}: ${c.weightPercentage}%`}
                                >
                                    <span className={styles.barPercentage}>{c.weightPercentage}%</span>
                                </div>
                            ))}
                        </div>

                        {/* Chú giải chi tiết bên dưới */}
                        <div className={styles.criteriaLegend}>
                            {event.criteria.map((c, idx) => (
                                <div key={idx} className={styles.legendItem}>
                                    <div className={styles.legendColor} style={{ '--segment-index': idx }} />
                                    <div className={styles.legendInfo}>
                                        <div className={styles.legendHeader}>
                                            <span className={styles.legendName}>{c.name}</span>
                                            <span className={styles.legendWeight}>{c.weightPercentage}%</span>
                                        </div>
                                        <p className={styles.legendDesc}>{c.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* DESCRIPTION */}
                <section className={styles.contentSection}>
                    <h3 className={styles.sectionTitle}>About this event</h3>
                    <p className={styles.description}>{event.description}</p>
                </section>

                {/* EXPERTS PANEL */}
                <section className={styles.contentSection}>
                    <h3 className={styles.sectionTitle}>The Evaluation Panel</h3>
                    <div className={styles.expertScrollContainer}>
                        <div className={styles.expertFlexWrapper}>
                            {expertsList.map((person) => {
                                if (person.isCreator) {
                                    return (
                                        <div key="creator" className={`${styles.personCard} ${styles.creatorCard}`}>
                                            <div className={styles.imageBox}>
                                                <img
                                                    src={person.displayAvatar}
                                                    alt={person.name}
                                                    className={styles.expertAvatar}
                                                />
                                                <span className={styles.organizerBadge}>Organizer</span>
                                            </div>
                                            <div className={styles.personInfo}>
                                                <h4>{person.name}</h4>
                                                <p>{person.role}</p>
                                            </div>
                                        </div>
                                    );
                                }

                                const status = getExpertStatusInfo(person.status);
                                return (
                                    <div key={person.expertId} className={styles.personCard}>
                                        <div className={styles.imageBox}>
                                            <img
                                                src={person.displayAvatar}
                                                alt={person.fullName}
                                                className={styles.expertAvatar}
                                            />
                                        </div>
                                        <div className={styles.personInfo}>
                                            <h4>{person.fullName}</h4>
                                            <p>{person.expertiseField}</p>
                                            <span className={`${styles.statusLabel} ${styles[status.variant]}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* PRIZES */}
                <section className={styles.contentSection}>
                    <h3 className={styles.sectionTitle}>Bounty Allocation</h3>
                    <PrizeSection prizes={event.prizes} />
                </section>

                {/* SUBMISSIONS */}
                <section className={styles.contentSection}>
                    <h3 className={styles.sectionTitle}>Intelligence Output Logs</h3>
                    <PostTable posts={posts} onPostClick={handleNavigateDetail} />
                </section>
            </main>

            {/* <AnimatePresence>
                {selectedPost && (
                    <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
                )}
            </AnimatePresence> */}
        </div>
    );
};

export default EventDetailPage;