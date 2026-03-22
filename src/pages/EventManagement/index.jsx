import React, { useState, useMemo } from 'react';
import styles from '@/features/events/styles/EventManagement.module.scss';
import { Filter, Loader2, RefreshCw } from 'lucide-react';
import { useEvents, EventRow, EventDetailModal, formatCurrency } from '@/features/events';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EventManagement = () => {
    const { events, loading, fetchEvents, handleApprove, handleReject } = useEvents();
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);

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
        </div>
    );
};

export default EventManagement;
// import React, { useState, useEffect } from 'react';
// import styles from './EventManagement.module.scss';
// import {
//     Filter, CheckCircle, XCircle, Eye, Loader2,
//     AlertCircle, Calendar, Users, DollarSign,
//     Trophy, Clock, Mail, Image as ImageIcon
// } from 'lucide-react';
// import axiosClient from '@/shared/lib/axios';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

// const EventManagement = () => {
//     const [events, setEvents] = useState([]);
//     const [filterStatus, setFilterStatus] = useState('All');
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [rejectReason, setRejectReason] = useState('');
//     const [showModal, setShowModal] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const fetchEvents = async () => {
//         setLoading(true);
//         try {
//             const res = await axiosClient.get('/events/admin/all');
//             setEvents(Array.isArray(res.data) ? res.data : []);
//         } catch (error) {
//             console.error("Lỗi fetch events:", error);
//             setEvents([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchEvents();
//     }, []);

//     const toastSuccess = (title) => {
//         MySwal.fire({
//             icon: 'success',
//             title,
//             toast: true,
//             position: 'top-end',
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//         });
//     };

//     const toastError = (title) => {
//         MySwal.fire({ icon: 'error', title, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
//     };

//     const handleApprove = async (id) => {
//         const result = await MySwal.fire({
//             title: 'Phê duyệt sự kiện?',
//             text: "Sự kiện sẽ được hiển thị công khai trên hệ thống!",
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonColor: '#10b981',
//             cancelButtonColor: '#64748b',
//             confirmButtonText: 'Xác nhận phê duyệt',
//             cancelButtonText: 'Hủy'
//         });

//         if (result.isConfirmed) {
//             try {
//                 await axiosClient.post(`/events/${id}/approve`);
//                 toastSuccess("Đã phê duyệt thành công!");
//                 fetchEvents();
//                 setShowModal(null);
//             } catch (err) {
//                 toastError(err.response?.data?.message || "Lỗi phê duyệt");
//             }
//         }
//     };

//     const handleReject = async () => {
//         if (!rejectReason.trim()) {
//             return toastError("Vui lòng nhập lý do từ chối");
//         }

//         try {
//             await axiosClient.post(`/events/${selectedEvent?.eventId}/reject`, {
//                 reason: rejectReason
//             });
//             toastSuccess("Đã từ chối và hoàn tiền thành công");
//             setRejectReason('');
//             setShowModal(null);
//             fetchEvents();
//         } catch (err) {
//             toastError("Lỗi khi thực hiện lệnh từ chối");
//         }
//     };

//     const filteredEvents = filterStatus === 'All'
//         ? events
//         : events.filter(e => e.status === filterStatus);

//     return (
//         <div className={styles.adminContainer}>
//             <header className={styles.header}>
//                 <div className={styles.titleGroup}>
//                     <h1>Quản lý Phê duyệt Sự kiện</h1>
//                     <p>Hệ thống kiểm duyệt nội dung và dòng tiền Escrow.</p>
//                 </div>
//             </header>

//             <div className={styles.filterBar}>
//                 <div className={styles.searchBox}>
//                     <Filter size={18} />
//                     <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
//                         <option value="All">Tất cả trạng thái</option>
//                         <option value="Pending_Review">Chờ duyệt</option>
//                         <option value="Active">Đang diễn ra</option>
//                         <option value="Rejected">Đã từ chối</option>
//                     </select>
//                 </div>
//                 {loading && <div className={styles.loader}><Loader2 className={styles.spin} size={18} /> Đang tải...</div>}
//             </div>

//             <div className={styles.tableWrapper}>
//                 <table className={styles.mainTable}>
//                     <thead>
//                         <tr>
//                             <th>Ngày tạo</th>
//                             <th>Sự kiện</th>
//                             <th>Thời gian</th>
//                             <th>Tổng ký quỹ</th>
//                             <th>Trạng thái</th>
//                             <th style={{ textAlign: 'right' }}>Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredEvents.map(ev => (
//                             <tr key={ev.eventId}>
//                                 <td>{new Date(ev.createdAt).toLocaleDateString('vi-VN')}</td>
//                                 <td className={styles.nameCol}>
//                                     <div className={styles.eventInfo}>
//                                         <strong>{ev.title}</strong>
//                                         <span><Users size={12} /> {ev.creatorName}</span>
//                                     </div>
//                                 </td>
//                                 <td className={styles.timeCol}>
//                                     <div className={styles.timeRange}>
//                                         <span>BĐ: {new Date(ev.startTime).toLocaleDateString('vi-VN')}</span>
//                                         <span>KT: {new Date(ev.endTime).toLocaleDateString('vi-VN')}</span>
//                                     </div>
//                                 </td>
//                                 <td className={styles.priceCol}>
//                                     {((ev.totalPrizePool || 0) + (ev.appliedFee || 0)).toLocaleString()} đ
//                                 </td>
//                                 <td>
//                                     <span className={`${styles.statusBadge} ${styles[ev.status?.toLowerCase()]}`}>
//                                         {ev.status}
//                                     </span>
//                                 </td>
//                                 <td style={{ textAlign: 'right' }}>
//                                     <button className={styles.btnView} onClick={() => { setSelectedEvent(ev); setShowModal('detail'); }}>
//                                         <Eye size={16} /> Chi tiết
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {showModal && selectedEvent && (
//                 <div className={styles.modalOverlay} onClick={() => setShowModal(null)}>
//                     <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
//                         <div className={styles.modalHeader}>
//                             <h2>{showModal === 'detail' ? 'Chi tiết phê duyệt' : 'Từ chối sự kiện'}</h2>
//                             <button className={styles.closeBtn} onClick={() => setShowModal(null)}>&times;</button>
//                         </div>

//                         <div className={styles.modalBody}>
//                             {showModal === 'detail' ? (
//                                 <div className={styles.scrollableContent}>
//                                     {/* Banner */}
//                                     <div className={styles.bannerSection}>
//                                         {selectedEvent.thumbnailUrl ? (
//                                             <img src={selectedEvent.thumbnailUrl} alt="Thumbnail" className={styles.bannerImg} />
//                                         ) : (
//                                             <div className={styles.noImage}><ImageIcon size={40} /> <span>Không có ảnh thumbnail</span></div>
//                                         )}
//                                         <div className={styles.bannerTitle}>
//                                             <h3>{selectedEvent.title}</h3>
//                                         </div>
//                                     </div>

//                                     <div className={styles.detailGrid}>
//                                         {/* Cột 1: Thời gian */}
//                                         <div className={styles.infoCard}>
//                                             <h4><Clock size={16} /> Lịch trình</h4>
//                                             <p>Bắt đầu: <strong>{new Date(selectedEvent.startTime).toLocaleString('vi-VN')}</strong></p>
//                                             <p>Kết thúc: <strong>{new Date(selectedEvent.endTime).toLocaleString('vi-VN')}</strong></p>
//                                         </div>

//                                         {/* Cột 2: Tài chính */}
//                                         <div className={styles.infoCard}>
//                                             <h4><DollarSign size={16} /> Tài chính (VNĐ)</h4>
//                                             <p>Tổng tiền giải: <strong>{selectedEvent.totalPrizePool?.toLocaleString()} đ</strong></p>
//                                             <p>Phí hệ thống: <strong>{selectedEvent.appliedFee?.toLocaleString()} đ</strong></p>
//                                             <div className={styles.totalHighlight}>
//                                                 <span>Tổng cộng ký quỹ:</span>
//                                                 <strong>{((selectedEvent.totalPrizePool || 0) + (selectedEvent.appliedFee || 0)).toLocaleString()} đ</strong>
//                                             </div>
//                                         </div>

//                                         {/* Cột 3: Người tạo */}
//                                         <div className={styles.infoCard}>
//                                             <h4><Users size={16} /> Người tổ chức</h4>
//                                             <p>Tên: <strong>{selectedEvent.creatorName}</strong></p>
//                                             <p><Mail size={14} /> {selectedEvent.creatorEmail}</p>
//                                         </div>

//                                         {/* Cột 4: Khác */}
//                                         <div className={styles.infoCard}>
//                                             <h4><Trophy size={16} /> Yêu cầu</h4>
//                                             <p>Expert tối thiểu: <strong>{selectedEvent.minExperts} người</strong></p>
//                                             <p>Tham gia: <strong>{selectedEvent.participantCount} người</strong></p>
//                                         </div>
//                                     </div>

//                                     {/* Action Footer */}
//                                     {selectedEvent.status === 'Pending_Review' && (
//                                         <div className={styles.modalFooter}>
//                                             <button onClick={() => handleApprove(selectedEvent.eventId)} className={styles.btnApprove}>
//                                                 <CheckCircle size={18} /> Phê duyệt ngay
//                                             </button>
//                                             <button onClick={() => setShowModal('reject')} className={styles.btnReject}>
//                                                 <XCircle size={18} /> Từ chối & Hoàn tiền
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className={styles.rejectForm}>
//                                     <div className={styles.warningBox}>
//                                         <AlertCircle size={20} />
//                                         <p>Lý do từ chối sẽ được thông báo cho người dùng. Toàn bộ <strong>{((selectedEvent.totalPrizePool || 0) + (selectedEvent.appliedFee || 0)).toLocaleString()} đ</strong> sẽ được hoàn trả.</p>
//                                     </div>
//                                     <textarea
//                                         rows={4}
//                                         placeholder="Nhập lý do chi tiết..."
//                                         value={rejectReason}
//                                         onChange={(e) => setRejectReason(e.target.value)}
//                                     />
//                                     <div className={styles.modalFooter}>
//                                         <button onClick={handleReject} className={styles.btnConfirmReject}>Xác nhận từ chối</button>
//                                         <button onClick={() => setShowModal('detail')} className={styles.btnBack}>Quay lại</button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EventManagement;