import { useState, useMemo, useCallback } from 'react';
import { Filter, Loader2, RefreshCw, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Nội bộ feature
import { useEvents, EventRow, EventDetailModal, QuickUpdateModal } from '@/features/events';
import styles from './EventManagement.module.scss';

const MySwal = withReactContent(Swal);
const ITEMS_PER_PAGE = 10;

const EventManagement = () => {
    // --- 1. Data & Custom Hooks ---
    const {
        events,
        loading,
        fetchEvents,
        handleApprove,
        handleReject,
        fetchEventById,
        handleUpdate
    } = useEvents();

    // --- 2. Local UI States ---
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // --- 3. Helper Functions (Memoized) ---
    const showToast = useCallback((icon, title) => {
        MySwal.fire({
            icon, title, toast: true, position: 'top-end',
            showConfirmButton: false, timer: 3000, timerProgressBar: true,
        });
    }, []);

    // --- 4. Logic Xử lý Dữ liệu ---
    // Lọc và Sắp xếp
    const filteredEvents = useMemo(() => {
        let result = filterStatus === 'All'
            ? events
            : events.filter(ev => ev.status === filterStatus);

        return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [events, filterStatus]);

    // Phân trang
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

    const currentTableData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEvents, currentPage]);

    // --- 5. Event Handlers ---
    const onRefresh = useCallback(async () => {
        await fetchEvents();
        setCurrentPage(1);
        showToast('success', 'Data refreshed successfully');
    }, [fetchEvents, showToast]);

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleEditClick = useCallback(async (briefEvent) => {
        const fullEvent = await fetchEventById(briefEvent.eventId);
        if (fullEvent) {
            setEditingEvent(fullEvent);
        } else {
            showToast('error', 'Could not load event details.');
        }
    }, [fetchEventById, showToast]);

    const onApproveConfirm = useCallback(async (id) => {
        const result = await MySwal.fire({
            title: 'Approve Event?',
            text: "This event will be published to the public marketplace.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Yes, Approve it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            const res = await handleApprove(id);
            if (res.success) {
                showToast('success', 'Event is now active!');
                setSelectedEvent(null);
            } else {
                showToast('error', res.error || 'Approval failed');
            }
        }
    }, [handleApprove, showToast]);

    const onRejectSubmit = useCallback(async (id, reason) => {
        const result = await handleReject(id, reason);
        if (result.success) {
            showToast('success', 'Event has been rejected.');
            setSelectedEvent(null);
        } else {
            showToast('error', result.error);
        }
    }, [handleReject, showToast]);

    const onUpdateSave = useCallback(async (id, dto) => {
        const result = await handleUpdate(id, dto);
        if (result.success) {
            showToast('success', 'Changes saved successfully!');
            setEditingEvent(null);
        } else {
            showToast('error', result.error);
        }
    }, [handleUpdate, showToast]);

    // --- 6. Sub-render Components (Làm code sạch hơn) ---
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className={styles.pagination}>
                <button
                    className={styles.pageBtn}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    <ChevronLeft size={18} />
                </button>
                <div className={styles.pageInfo}>
                    Page <span>{currentPage}</span> of {totalPages}
                </div>
                <button
                    className={styles.pageBtn}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        );
    };

    return (
        <div className={styles.adminContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Event Management</h1>
                    <p>Review content and monitor escrow security funds.</p>
                </div>
                <button
                    className={styles.btnRefresh}
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <RefreshCw size={16} className={loading ? styles.spin : ''} />
                    <span>{loading ? 'Updating...' : 'Refresh'}</span>
                </button>
            </header>

            {/* Filter & Actions Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <Filter size={18} className={styles.filterIcon} />
                    <select value={filterStatus} onChange={handleFilterChange}>
                        <option value="All">All Statuses ({events.length})</option>
                        <option value="Pending_Review">Pending Review</option>
                        <option value="Active">Active</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {loading && (
                    <div className={styles.statusIndicator}>
                        <Loader2 className={styles.spin} size={16} />
                        <span>Syncing...</span>
                    </div>
                )}
            </div>

            {/* Main Content Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.mainTable}>
                        <thead>
                            <tr>
                                <th>Created At</th>
                                <th>Event Details</th>
                                <th>Schedule</th>
                                <th>Escrow Fund</th>
                                <th>Status</th>
                                <th className={styles.textRight}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTableData.length > 0 ? (
                                currentTableData.map(ev => (
                                    <EventRow
                                        key={ev.eventId}
                                        event={ev}
                                        onOpenDetail={setSelectedEvent}
                                        onQuickEdit={handleEditClick}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">
                                        <div className={styles.emptyState}>
                                            <Inbox size={48} />
                                            <p>No events match your current filter.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {renderPagination()}
            </div>

            {/* Modal Layers */}
            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onApprove={onApproveConfirm}
                    onReject={onRejectSubmit}
                />
            )}

            {editingEvent && (
                <QuickUpdateModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onSave={onUpdateSave}
                />
            )}
        </div>
    );
};

export default EventManagement;