import React, { useState, useMemo, useEffect } from "react";
import { Plus, Loader2, ChevronLeft, ChevronRight, ClipboardCheck, LayoutGrid, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "@/features/events/styles/MyEvents.module.scss";
import { PATHS } from "@/app/routes/paths";
import { EmptyEvents, EventToolbar, EventCard, useMyEvents } from '@/features/events';

const ITEMS_PER_PAGE = 6;

const MyEventsPage = () => {
    const navigate = useNavigate();
    const { hostedEvents, judgingEvents, loading } = useMyEvents();

    const [activeTab, setActiveTab] = useState("hosted");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const now = new Date();
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab, statusFilter, sortOrder]);

    // Chọn danh sách dựa trên Tab
    const currentRawList = useMemo(() => {
        return activeTab === "hosted" ? hostedEvents : judgingEvents;
    }, [activeTab, hostedEvents, judgingEvents]);

    const filteredEvents = useMemo(() => {
        let list = [...currentRawList];

        // 1. Lọc theo Search Term
        list = list.filter((event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // 2. Lọc theo Status (Active/Completed)
        if (statusFilter !== "All") {
            list = list.filter((event) =>
                event.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // 3. Sắp xếp theo Date
        list.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

        return list;
    }, [currentRawList, searchTerm, statusFilter, sortOrder]);

    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

    const paginatedEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredEvents, currentPage]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.spinner} size={40} />
                <p>Đang tải dữ liệu sự kiện...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Quản lý sự kiện</h1>
                    <p>Theo dõi và quản lý các hoạt động workshop của bạn.</p>
                </div>

                {activeTab === "hosted" && (
                    <button
                        className={styles.btnCreate}
                        onClick={() => navigate(PATHS.EXPERT_CREATE_EVENTS)}
                    >
                        <Plus size={20} />
                        <span>Tạo sự kiện</span>
                    </button>
                )}
            </header>

            {/* Hệ thống Tab Role */}
            <div className={styles.tabWrapper}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'hosted' ? styles.active : ''}`}
                    onClick={() => setActiveTab('hosted')}
                >
                    <LayoutGrid size={18} />
                    Sự kiện tôi tạo ({hostedEvents.length})
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'judging' ? styles.active : ''}`}
                    onClick={() => setActiveTab('judging')}
                >
                    <Award size={18} />
                    Tôi chấm điểm ({judgingEvents.length})
                </button>
            </div>

            {currentRawList.length > 0 ? (
                <>
                    <EventToolbar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />

                    {filteredEvents.length > 0 ? (
                        <>
                            <div className={styles.eventGrid}>
                                {paginatedEvents.map((event, index) => {
                                    const deadline = new Date(event.submissionDeadline);

                                    // Điều kiện hiện nút Review:
                                    // 1. Nếu là Host: Event Active
                                    // 2. Nếu là Expert: Event Active + Đã qua deadline nộp bài
                                    const canReview =
                                        event.status?.toLowerCase() === "active" &&
                                        now >= deadline;
                                    const isCompleted = event.status?.toLowerCase() === "completed";

                                    return (
                                        <div key={event.eventId} className={styles.eventCardWrapper}>
                                            <EventCard
                                                event={event}
                                                index={index}
                                                // Prop này để Card hiển thị thù lao nếu là judging
                                                isJudgingMode={activeTab === 'judging'}
                                                onClick={() =>
                                                    navigate(PATHS.EXPERT_EVENT_DETAIL.replace(':id', event.eventId))
                                                }
                                            />

                                            {(canReview || isCompleted) && (
                                                <div className={styles.cardActions}>
                                                    {/* Nút Review (Chấm điểm/Xem bài nộp) */}
                                                    {canReview && (
                                                        <button
                                                            className={styles.btnReview}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(PATHS.EXPERT_SUBMISSION_REVIEW.replace(':eventId', event.eventId));
                                                            }}
                                                        >
                                                            <ClipboardCheck size={16} />
                                                            <span>{activeTab === 'hosted' ? 'Xem bài nộp' : 'Chấm điểm'}</span>
                                                        </button>
                                                    )}

                                                    {/* Nút Xem kết quả */}
                                                    {isCompleted && (
                                                        <button
                                                            className={`${styles.btnReview} ${styles.btnSummaryFloating}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(PATHS.EXPERT_SUMMARY_EVENT.replace(':id', event.eventId));
                                                            }}
                                                        >
                                                            <Award size={16} />
                                                            <span>Xem kết quả</span>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
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
                                        Trang <strong>{currentPage}</strong> / {totalPages}
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
                    isJudging={activeTab === 'judging'}
                    onCreate={() => navigate(PATHS.EXPERT_CREATE_EVENTS)}
                />
            )}
        </div>
    );
};

export default MyEventsPage;