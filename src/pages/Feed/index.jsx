import { useState } from 'react';
import { useFeed, FashionCard, CreatePostModal } from '@/features/feed';
import { EventMiniCard, EventQuickViewModal } from '@/features/events';
import styles from './Feed.module.scss';
import { useAuth } from '@/app/providers/AuthProvider';

const FashionFeed = () => {

    const { user: currentUser } = useAuth();

    const {
        posts,
        isLoading,
        hasMore,
        lastPostRef,
        commentsMap,
        toggleComments,
        addComment,
        toggleLike,
        events,
        isEventsLoading,
        refreshAll,
    } = useFeed();

    const [showAllEvents, setShowAllEvents] = useState(false);

    const displayedEvents = showAllEvents ? events : events.slice(0, 2);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    const handleOpenQuickView = (event) => {
        setSelectedEvent(event);
        setIsQuickViewOpen(true);
    };

    const handleJoinFromQuickView = (event) => {
        setIsQuickViewOpen(false);
        setIsCreatePostOpen(true);
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString.includes('Z') ? dateString : dateString + 'Z');
        const now = new Date();


        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 0) return 'Vừa xong';
        if (diffInSeconds < 60) return 'Vừa xong';

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    return (
        <>
            <div className={styles.feedPage}>
                <div className={styles.feedLayout}>
                    {/* Sidebar: Quản lý Events */}
                    <aside className={styles.sidebar}>
                        <div className={styles.eventSection}>
                            <h3 className={styles.sectionTitle}>Featured Events</h3>

                            {isEventsLoading && (
                                <div className={styles.loadingText}>Loading events...</div>
                            )}

                            {!isEventsLoading && events.length === 0 && (
                                <p className={styles.emptyText}>No events available</p>
                            )}

                            <div className={styles.eventList}>
                                {displayedEvents.map(event => (
                                    <EventMiniCard key={event.eventId} event={event} onOpenQuickView={handleOpenQuickView} />
                                ))}
                            </div>

                            {events.length > 2 && (
                                <button
                                    className={styles.showMoreBtn}
                                    onClick={() => setShowAllEvents(!showAllEvents)}
                                >
                                    {showAllEvents ? 'Show Less' : `View All (${events.length})`}
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Main: Danh sách bài viết (Infinite Scroll) */}
                    <main className={styles.feedContainer}>
                        {posts.map((post, index) => (
                            <FashionCard
                                key={post.postId}
                                post={post}
                                // Gán ref cho phần tử cuối cùng để kích hoạt observer
                                lastPostRef={index === posts.length - 1 ? lastPostRef : null}
                                commentsMap={commentsMap}
                                toggleComments={toggleComments}
                                addComment={addComment}
                                formatTime={formatTime}
                                toggleLike={toggleLike}
                            />
                        ))}

                        {/* Loading state khi kéo xuống */}
                        {isLoading && (
                            <div className={styles.loaderWrapper}>
                                <div className={styles.spinner}></div>
                                <span>Loading new trends...</span>
                            </div>
                        )}

                        {/* Hết dữ liệu */}
                        {!hasMore && posts.length > 0 && (
                            <div className={styles.endMessage}>
                                <div className={styles.line}></div>
                                <span>You've seen all the trends for today</span>
                                <div className={styles.line}></div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <EventQuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                event={selectedEvent}
                onJoinClick={handleJoinFromQuickView}
                user={currentUser}
            />

            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => setIsCreatePostOpen(false)}
                fixedEventId={selectedEvent?.eventId}
                eventName={selectedEvent?.title}
                user={currentUser}
                onSuccess={() => {
                    refreshAll();
                    setIsCreatePostOpen(false);
                }}
            />
        </>
    );
};

export default FashionFeed;