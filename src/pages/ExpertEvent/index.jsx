import React, { useState, useMemo, useEffect } from "react";
import { Plus, Loader2, ChevronLeft, ChevronRight, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "@/features/events/styles/MyEvents.module.scss";

import { PATHS } from "@/app/routes/paths";
import { EmptyEvents, EventToolbar, EventCard, useMyEvents } from '@/features/events';

const ITEMS_PER_PAGE = 6;

const MyEventsPage = () => {
    const navigate = useNavigate();
    const { events, loading } = useMyEvents();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [events, searchTerm]);

    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    
    const paginatedEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredEvents, currentPage]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.spinner} size={40} />
                <p>Loading your events...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>My Events</h1>
                    <p>Manage and track your fashion workshops.</p>
                </div>

                <button
                    className={styles.btnCreate}
                    onClick={() => navigate(PATHS.EXPERT_CREATE_EVENTS)}
                >
                    <Plus size={20} />
                    <span>Create Event</span>
                </button>
            </header>

            {events.length > 0 ? (
                <>
                    <EventToolbar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    {filteredEvents.length > 0 ? (
                        <>
                            <div className={styles.eventGrid}>
                                {paginatedEvents.map((event, index) => (
                                    <div key={event.eventId} className={styles.eventCardWrapper}>
                                        <EventCard
                                            event={event}
                                            index={index}
                                            onClick={() =>
                                                navigate(PATHS.EXPERT_EVENT_DETAIL.replace(':id', event.eventId))
                                            }
                                        />
                                        
                                        {/* Nút Submission Review: Ẩn nếu status là Cancelled */}
                                        {event.status?.toLowerCase() !== "cancelled" && (
                                            <div className={styles.cardActions}>
                                                <button 
                                                    className={styles.btnReview}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Điều hướng đến trang chấm điểm bài thi
                                                        navigate(`/expert/events/${event.eventId}/submissions`);
                                                    }}
                                                >
                                                    <ClipboardCheck size={16} />
                                                    <span>Submission Review</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button 
                                        className={styles.pageBtn}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    
                                    <div className={styles.pageNumbers}>
                                        Trang <strong>{currentPage}</strong> trên {totalPages}
                                    </div>

                                    <button 
                                        className={styles.pageBtn}
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.noResults}>
                            <p>Không tìm thấy sự kiện nào khớp với "{searchTerm}"</p>
                        </div>
                    )}
                </>
            ) : (
                <EmptyEvents
                    onCreate={() => navigate(PATHS.EXPERT_CREATE_EVENTS)}
                />
            )}
        </div>
    );
};

export default MyEventsPage;