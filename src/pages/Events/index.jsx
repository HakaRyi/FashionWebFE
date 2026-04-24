import { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, RefreshCcw, X, ArrowUpDown } from 'lucide-react';
import { CreatePostModal } from '@/features/feed';
import { EventMiniCard, EventQuickViewModal, usePublicEvents } from '@/features/events';
import { useAuth } from '@/app/providers/AuthProvider';
import styles from './EventsPage.module.scss';

const EventsPage = () => {
    const { user: currentUser } = useAuth();

    // Sử dụng đầy đủ các tính năng từ Hook đã nâng cấp
    const {
        events,
        isLoading,
        searchTerm,
        setSearchTerm,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        sortOrder,
        setSortOrder,
        resetFilters,
        refreshEvents
    } = usePublicEvents();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 8;

    // Kiểm tra xem có bất kỳ bộ lọc nào đang hoạt động không
    const isFiltering = searchTerm !== '' || startDate !== '' || endDate !== '' || sortOrder !== 'newest';

    const totalPages = Math.ceil(events.length / eventsPerPage);

    // Tính toán danh sách sự kiện cho trang hiện tại
    const currentEvents = useMemo(() => {
        const firstIndex = (currentPage - 1) * eventsPerPage;
        return events.slice(firstIndex, firstIndex + eventsPerPage);
    }, [events, currentPage]);

    // Reset về trang 1 khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, startDate, endDate, sortOrder]);

    const handleOpenQuickView = (event) => {
        setSelectedEvent(event);
        setIsQuickViewOpen(true);
    };

    const handleJoinFromQuickView = () => {
        setIsQuickViewOpen(false);
        // Delay nhẹ để modal cũ đóng hẳn trước khi mở modal tạo post
        setTimeout(() => setIsCreatePostOpen(true), 300);
    };

    return (
        <div className={styles.eventsPage}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Fashion Events</h1>
                    <button
                        className={`${styles.refreshIconBtn} ${isLoading ? styles.spinning : ''}`}
                        onClick={refreshEvents}
                        disabled={isLoading}
                        title="Refresh database"
                    >
                        <RefreshCcw size={20} />
                    </button>
                </div>
                <p>Curated competitions, runway shows, and creative workshops for you.</p>
            </header>

            <section className={styles.filterBar}>
                {/* Search Box */}
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search by event name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className={styles.clearInput} onClick={() => setSearchTerm('')}>
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className={styles.actionGroup}>
                    {/* Date Range Picker */}
                    <div className={styles.rangePicker}>
                        <div className={styles.dateInput}>
                            <label>From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className={styles.dateInput}>
                            <label>To</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Sort Selector */}
                    <div className={styles.sortWrapper}>
                        <select
                            className={styles.sortSelect}
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>

                    {isFiltering && (
                        <button className={styles.resetLink} onClick={resetFilters}>
                            Reset all
                        </button>
                    )}
                </div>
            </section>

            <main className={styles.mainContent}>
                {isLoading ? (
                    <div className={styles.loadingArea}>
                        <div className={styles.loader}></div>
                        <span>Updating fashion feed...</span>
                    </div>
                ) : currentEvents.length > 0 ? (
                    <>
                        <div className={styles.grid}>
                            {currentEvents.map(event => (
                                <EventMiniCard
                                    key={event.eventId}
                                    event={event}
                                    onOpenQuickView={handleOpenQuickView}
                                />
                            ))}
                        </div>

                        {/* Pagination Section */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    Prev
                                </button>
                                <div className={styles.pageDots}>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={currentPage === i + 1 ? styles.activePage : ''}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyArt}>✨</div>
                        <h3>No events found</h3>
                        <p>Try adjusting your date range or keywords to find what you're looking for.</p>
                        <button onClick={resetFilters}>Explore All Events</button>
                    </div>
                )}
            </main>

            {/* Modals */}
            <EventQuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                event={selectedEvent}
                user={currentUser}
                onJoinClick={handleJoinFromQuickView}
            />

            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => {
                    setIsCreatePostOpen(false);
                    setSelectedEvent(null);
                }}
                fixedEventId={selectedEvent?.eventId}
                eventName={selectedEvent?.title}
                entryFee={selectedEvent?.entryFee || 0}
                user={currentUser}
                onSuccess={() => {
                    refreshEvents();
                    setIsCreatePostOpen(false);
                }}
            />
        </div>
    );
};

export default EventsPage;