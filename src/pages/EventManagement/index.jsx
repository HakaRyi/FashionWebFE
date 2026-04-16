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
        setCurrentPage(1); // Quan trọng: Reset về trang 1 khi lọc
    };

    const onRefresh = async () => {
        await fetchEvents();
        setCurrentPage(1);
        showToast('info', 'Đã cập nhật dữ liệu mới');
    };

    const handleEditClick = async (briefEvent) => {
        const fullEvent = await fetchEventById(briefEvent.eventId);
        if (fullEvent) {
            setEditingEvent(fullEvent);
        } else {
            showToast('error', 'Không thể lấy thông tin chi tiết');
        }
    };

    const onApproveClick = async (id) => {
        const confirm = await MySwal.fire({
            title: 'Phê duyệt sự kiện?',
            text: "Sự kiện sẽ được hiển thị công khai trên hệ thống!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Xác nhận phê duyệt',
            cancelButtonText: 'Hủy'
        });

        if (confirm.isConfirmed) {
            const result = await handleApprove(id);
            if (result.success) {
                showToast('success', 'Đã phê duyệt thành công!');
                setSelectedEvent(null);
            } else {
                showToast('error', result.error);
            }
        }
    };

    const onRejectSubmit = async (id, reason) => {
        const result = await handleReject(id, reason);
        if (result.success) {
            showToast('success', 'Đã từ chối thành công');
            setSelectedEvent(null);
        } else {
            showToast('error', result.error);
        }
    };

    const onUpdateSave = async (id, dto) => {
        const result = await handleUpdate(id, dto);
        if (result.success) {
            showToast('success', 'Cập nhật thành công!');
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
                    <h1>Quản lý Phê duyệt Sự kiện</h1>
                    <p>Hệ thống kiểm duyệt nội dung và dòng tiền Escrow.</p>
                </div>
                <button className={styles.btnRefresh} onClick={onRefresh} disabled={loading}>
                    <RefreshCw size={16} className={loading ? styles.spin : ''} /> 
                    <span>Làm mới</span>
                </button>
            </header>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <Filter size={18} />
                    <select value={filterStatus} onChange={handleStatusChange}>
                        <option value="All">Tất cả trạng thái ({events.length})</option>
                        <option value="Pending_Review">Chờ duyệt</option>
                        <option value="Active">Đang diễn ra</option>
                        <option value="Rejected">Đã từ chối</option>
                    </select>
                </div>
                {loading && (
                    <div className={styles.loader}>
                        <Loader2 className={styles.spin} size={18} /> 
                        <span>Đang xử lý...</span>
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className={styles.tableWrapper}>
                <table className={styles.mainTable}>
                    <thead>
                        <tr>
                            <th>Ngày tạo</th>
                            <th>Sự kiện</th>
                            <th>Thời gian</th>
                            <th>Tổng ký quỹ</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'right' }}>Hành động</th>
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
                                    Không có dữ liệu sự kiện nào phù hợp.
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
                            Trang <strong>{currentPage}</strong> / {totalPages}
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