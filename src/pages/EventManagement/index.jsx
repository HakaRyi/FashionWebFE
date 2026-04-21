import React, { useState, useMemo, useCallback } from 'react';
import styles from '@/features/events/styles/EventManagement.module.scss';
import { Filter, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEvents, EventRow, EventDetailModal, QuickUpdateModal } from '@/features/events';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EventManagement = () => {
    // --- Data Hooks ---
    const {
        events, loading, fetchEvents, handleApprove,
        handleReject, fetchEventById, handleUpdate
    } = useEvents();

    // --- UI States ---
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    // --- Pagination States ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- Notifications ---
    const showToast = useCallback((icon, title) => {
        MySwal.fire({
            icon, title, toast: true, position: 'top-end',
            showConfirmButton: false, timer: 3000, timerProgressBar: true,
        });
    }, []);

    // --- Logic: Filter & Sort (Memoized) ---
    const filteredEvents = useMemo(() => {
        const result = filterStatus === 'All'
            ? events
            : events.filter(ev => ev.status === filterStatus);

        // Đảm bảo tính bất biến (immutability) khi sort
        return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [events, filterStatus]);

    // --- Logic: Pagination Calculations ---
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const currentTableData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredEvents.slice(start, start + itemsPerPage);
    }, [filteredEvents, currentPage]);

    // --- Event Handlers ---
    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    const onRefresh = async () => {
        await fetchEvents();
        setCurrentPage(1);
        showToast('info', 'Data has been updated.');
    };

    const handleEditClick = async (briefEvent) => {
        const fullEvent = await fetchEventById(briefEvent.eventId);
        if (fullEvent) {
            setEditingEvent(fullEvent);
        } else {
            showToast('error', 'Details cannot be obtained.');
        }
    };

    const onApproveClick = async (id) => {
        const confirm = await MySwal.fire({
            title: 'Approve Event?',
            text: "The event will be displayed publicly on the system!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Confirm Approval',
            cancelButtonText: 'Hủy'
        });

        if (confirm.isConfirmed) {
            const result = await handleApprove(id);
            if (result.success) {
                showToast('success', 'Event approved successfully!');
                setSelectedEvent(null);
            } else {
                showToast('error', result.error);
            }
        }
    };

    const onRejectSubmit = async (id, reason) => {
        const result = await handleReject(id, reason);
        if (result.success) {
            showToast('success', 'Event rejected successfully!');
            setSelectedEvent(null);
        } else {
            showToast('error', result.error);
        }
    };

    const onUpdateSave = async (id, dto) => {
        const result = await handleUpdate(id, dto);
        if (result.success) {
            showToast('success', 'Event updated successfully!');
            setEditingEvent(null);
        } else {
            showToast('error', result.error);
        }
    };

    return (
        <div className={styles.adminContainer}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Event Management</h1>
                    <p>Content moderation and Escrow fund management system.</p>
                </div>
                <button className={styles.btnRefresh} onClick={onRefresh} disabled={loading}>
                    <RefreshCw size={16} className={loading ? styles.spin : ''} />
                    <span>Refresh</span>
                </button>
            </header>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <Filter size={18} />
                    <select value={filterStatus} onChange={handleStatusChange}>
                        <option value="All">All statuses ({events.length})</option>
                        <option value="Pending_Review">Pending Review</option>
                        <option value="Active">Active</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                {loading && (
                    <div className={styles.loader}>
                        <Loader2 className={styles.spin} size={18} />
                        <span>Processing...</span>
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className={styles.tableWrapper}>
                <table className={styles.mainTable}>
                    <thead>
                        <tr>
                            <th>Creation Date</th>
                            <th>Event</th>
                            <th>Time</th>
                            <th>Total Escrow</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTableData.length > 0 ? (
                            currentTableData.map(ev => (
                                <EventRow
                                    key={ev.eventId}
                                    event={ev}
                                    onOpenDetail={setSelectedEvent}
                                    onQuickEdit={() => handleEditClick(ev)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className={styles.noData}>
                                    No matching event data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className={styles.pageInfo}>
                            Page <strong>{currentPage}</strong> / {totalPages}
                        </div>

                        <button
                            className={styles.pageBtn}
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onApprove={onApproveClick}
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