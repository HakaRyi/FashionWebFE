import React, { useState, useMemo } from 'react';
import styles from '@/features/events/styles/EventManagement.module.scss';
import { Filter, Loader2, RefreshCw } from 'lucide-react';
import { useEvents, EventRow, EventDetailModal, QuickUpdateModal } from '@/features/events';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EventManagement = () => {
    const { events, loading, fetchEvents, handleApprove, handleReject, fetchEventById, handleUpdate, isFetchingDetail } = useEvents();
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    const filteredEvents = useMemo(() => {
        if (filterStatus === 'All') return events;
        return events.filter(ev => ev.status === filterStatus);
    }, [events, filterStatus]);

    const showToast = (icon, title) => {
        MySwal.fire({
            icon, title, toast: true, position: 'top-end',
            showConfirmButton: false, timer: 3000, timerProgressBar: true,
        });
    };

    const handleEditClick = async (briefEvent) => {
        const fullEvent = await fetchEventById(briefEvent.eventId);

        if (fullEvent) {
            setEditingEvent(fullEvent);
        } else {
            showToast('error', 'Không thể lấy thông tin chi tiết để chỉnh sửa');
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
            showToast('success', 'Đã từ chối và hoàn tiền thành công');
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
            <header className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Quản lý Phê duyệt Sự kiện</h1>
                    <p>Hệ thống kiểm duyệt nội dung và dòng tiền Escrow.</p>
                </div>
                <button className={styles.btnRefresh} onClick={fetchEvents} disabled={loading}>
                    <RefreshCw size={16} className={loading ? styles.spin : ''} /> Làm mới
                </button>
            </header>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <Filter size={18} />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="All">Tất cả trạng thái</option>
                        <option value="Pending_Review">Chờ duyệt</option>
                        <option value="Active">Đang diễn ra</option>
                        <option value="Rejected">Đã từ chối</option>
                    </select>
                </div>
                {loading && (
                    <div className={styles.loader}>
                        <Loader2 className={styles.spin} size={18} /> Đang tải...
                    </div>
                )}
            </div>

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
                        {filteredEvents.map(ev => (
                            <EventRow
                                key={ev.eventId}
                                event={ev}
                                onOpenDetail={setSelectedEvent}
                                onQuickEdit={() => handleEditClick(ev)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

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