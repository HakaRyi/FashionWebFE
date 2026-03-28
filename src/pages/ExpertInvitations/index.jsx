import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, History, Clock, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { invitationApi, InvitationCard, useInvitations, InvitationDetailModal } from '@/features/expert';
import styles from '@/features/expert/styles/ExpertInvitations.module.scss';

const MySwal = withReactContent(Swal);

const ExpertInvitations = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedInvite, setSelectedInvite] = useState(null);
    
    const { invites, loading, fetchInvites, toastError, MySwal } = useInvitations(activeTab);

    const handleResponse = async (eventId, accept) => {
        const actionText = accept ? "chấp nhận" : "từ chối";
        
        const confirm = await MySwal.fire({
            title: `Xác nhận ${actionText}?`,
            text: accept ? "Bạn sẽ tham gia vào hội đồng chấm điểm của sự kiện này." : "Bạn sẽ từ chối lời mời này.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: accept ? '#10b981' : '#ef4444',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Đóng'
        });

        if (confirm.isConfirmed) {
            try {
                await invitationApi.respondToInvitation(eventId, accept);
                
                MySwal.fire({
                    title: 'Thành công!',
                    text: `Đã ${actionText} lời mời.`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                setSelectedInvite(null);
                fetchInvites(); 
            } catch (error) {
                toastError(error.response?.data?.message || "Thao tác thất bại");
            }
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleInfo}>
                    <h1>Lời mời tham gia</h1>
                    <p>Xem chi tiết sự kiện và xác nhận vai trò Expert của bạn</p>
                </div>

                <div className={styles.tabSwitcher}>
                    <button 
                        className={activeTab === 'pending' ? styles.active : ''} 
                        onClick={() => setActiveTab('pending')}
                    >
                        <Clock size={16} /> Đang chờ
                        {activeTab === 'pending' && invites.length > 0 && (
                            <span className={styles.badge}>{invites.length}</span>
                        )}
                    </button>
                    <button 
                        className={activeTab === 'history' ? styles.active : ''} 
                        onClick={() => setActiveTab('history')}
                    >
                        <History size={16} /> Đang tham gia
                    </button>
                </div>
            </header>

            <main className={styles.content}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <Loader2 className={styles.spin} size={40} />
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={styles.grid}
                        >
                            {invites.length > 0 ? (
                                invites.map(invite => (
                                    <InvitationCard 
                                        key={invite.eventId} 
                                        invite={invite} 
                                        isHistory={activeTab === 'history'}
                                        onViewDetail={() => setSelectedInvite(invite)}
                                        onAccept={(id) => handleResponse(id, true)}
                                        onDecline={(id) => handleResponse(id, false)}
                                    />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}><Mail size={48} /></div>
                                    <p>Không có lời mời nào trong mục này.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>

            <AnimatePresence>
                {selectedInvite && (
                    <InvitationDetailModal 
                        invite={selectedInvite} 
                        onClose={() => setSelectedInvite(null)} 
                        onAccept={(id) => handleResponse(id, true)}
                        onDecline={(id) => handleResponse(id, false)}
                        isHistory={activeTab === 'history'}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExpertInvitations;


// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//     Mail, Calendar, User, Check, X, History, 
//     Clock, MapPin, Trophy, Users, Info, Loader2 
// } from 'lucide-react';
// import axiosClient from '@/shared/lib/axios'; // Đảm bảo đường dẫn axios của bạn đúng
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import styles from './ExpertInvitations.module.scss';

// const MySwal = withReactContent(Swal);

// const ExpertInvitations = () => {
//     const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'
//     const [selectedInvite, setSelectedInvite] = useState(null);
//     const [invites, setInvites] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // 1. Fetch dữ liệu từ API dựa trên Tab
//     const fetchInvites = async () => {
//         setLoading(true);
//         try {
//             // Tab 'pending' gọi api/event-expert/my-invitations
//             // Tab 'history' gọi api/event-expert/my-assigned-events (hoặc API lịch sử nếu có)
//             const endpoint = activeTab === 'pending' 
//                 ? '/event-expert/my-invitations' 
//                 : '/event-expert/my-assigned-events';
            
//             const res = await axiosClient.get(endpoint);
//             setInvites(res.data);
//         } catch (error) {
//             toastError("Không thể tải danh sách lời mời");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchInvites();
//     }, [activeTab]);

//     // 2. Xử lý Chấp nhận/Từ chối qua API
//     const handleResponse = async (eventId, accept) => {
//         const actionText = accept ? "chấp nhận" : "từ chối";
        
//         const confirm = await MySwal.fire({
//             title: `Xác nhận ${actionText}?`,
//             text: accept ? "Bạn sẽ tham gia vào hội đồng chấm điểm của sự kiện này." : "Bạn sẽ từ chối lời mời này.",
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonColor: accept ? '#10b981' : '#ef4444',
//             confirmButtonText: 'Xác nhận',
//             cancelButtonText: 'Đóng'
//         });

//         if (confirm.isConfirmed) {
//             try {
//                 // Gọi API: POST /api/event-expert/respond/{eventId}?accept=true/false
//                 await axiosClient.post(`/event-expert/respond/${eventId}?accept=${accept}`);
                
//                 MySwal.fire({
//                     title: 'Thành công!',
//                     text: `Đã ${actionText} lời mời.`,
//                     icon: 'success',
//                     timer: 2000,
//                     showConfirmButton: false
//                 });

//                 setSelectedInvite(null);
//                 fetchInvites(); // Reload danh sách
//             } catch (error) {
//                 toastError(error.response?.data?.message || "Thao tác thất bại");
//             }
//         }
//     };

//     const toastError = (message) => {
//         MySwal.fire({ icon: 'error', title: 'Lỗi', text: message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
//     };

//     return (
//         <div className={styles.container}>
//             <header className={styles.header}>
//                 <div className={styles.titleInfo}>
//                     <h1>Lời mời tham gia</h1>
//                     <p>Xem chi tiết sự kiện và xác nhận vai trò Expert của bạn</p>
//                 </div>

//                 <div className={styles.tabSwitcher}>
//                     <button 
//                         className={activeTab === 'pending' ? styles.active : ''} 
//                         onClick={() => setActiveTab('pending')}
//                     >
//                         <Clock size={16} /> Đang chờ
//                         {activeTab === 'pending' && invites.length > 0 && (
//                             <span className={styles.badge}>{invites.length}</span>
//                         )}
//                     </button>
//                     <button 
//                         className={activeTab === 'history' ? styles.active : ''} 
//                         onClick={() => setActiveTab('history')}
//                     >
//                         <History size={16} /> Đang tham gia
//                     </button>
//                 </div>
//             </header>

//             <main className={styles.content}>
//                 {loading ? (
//                     <div className={styles.loadingState}>
//                         <Loader2 className={styles.spin} size={40} />
//                         <p>Đang tải dữ liệu...</p>
//                     </div>
//                 ) : (
//                     <AnimatePresence mode="wait">
//                         <motion.div 
//                             key={activeTab}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -10 }}
//                             className={styles.grid}
//                         >
//                             {invites.length > 0 ? (
//                                 invites.map(invite => (
//                                     <InvitationCard 
//                                         key={invite.eventId} 
//                                         invite={invite} 
//                                         isHistory={activeTab === 'history'}
//                                         onViewDetail={() => setSelectedInvite(invite)}
//                                         onAccept={(id) => handleResponse(id, true)}
//                                         onDecline={(id) => handleResponse(id, false)}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className={styles.emptyState}>
//                                     <div className={styles.emptyIcon}><Mail size={48} /></div>
//                                     <p>Không có lời mời nào trong mục này.</p>
//                                 </div>
//                             )}
//                         </motion.div>
//                     </AnimatePresence>
//                 )}
//             </main>

//             <AnimatePresence>
//                 {selectedInvite && (
//                     <InvitationDetailModal 
//                         invite={selectedInvite} 
//                         onClose={() => setSelectedInvite(null)} 
//                         onAccept={(id) => handleResponse(id, true)}
//                         onDecline={(id) => handleResponse(id, false)}
//                         isHistory={activeTab === 'history'}
//                     />
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// // --- Sub-components (Mapping đúng theo DTO Backend trả về) ---

// const InvitationCard = ({ invite, isHistory, onViewDetail, onAccept, onDecline }) => (
//     <div className={styles.card} onClick={onViewDetail}>
//         <div className={styles.banner}>
//             <img src={invite.thumbnailUrl || '/default-event.jpg'} alt="event" />
//             <div className={`${styles.statusBadge} ${styles[invite.status?.toLowerCase()]}`}>
//                 {isHistory ? 'Đang tham gia' : 'Mới'}
//             </div>
//         </div>
        
//         <div className={styles.cardBody}>
//             <h3 className={styles.eventTitle}>{invite.title}</h3>
            
//             <div className={styles.meta}>
//                 <span><User size={14} /> {invite.creatorName}</span>
//                 <span><Calendar size={14} /> {new Date(invite.startTime).toLocaleDateString()}</span>
//             </div>

//             <p className={styles.description}>{invite.description}</p>

//             {!isHistory ? (
//                 <div className={styles.actions} onClick={e => e.stopPropagation()}>
//                     <button onClick={() => onDecline(invite.eventId)} className={styles.btnDecline}>
//                         Từ chối
//                     </button>
//                     <button onClick={() => onAccept(invite.eventId)} className={styles.btnAccept}>
//                         Chấp nhận
//                     </button>
//                 </div>
//             ) : (
//                 <div className={styles.historyFooter}>
//                     <Check size={14} /> Bạn đã tham gia sự kiện này
//                 </div>
//             )}
//         </div>
//     </div>
// );

// const InvitationDetailModal = ({ invite, onClose, onAccept, onDecline, isHistory }) => (
//     <motion.div 
//         className={styles.modalOverlay}
//         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//         onClick={onClose}
//     >
//         <motion.div 
//             className={styles.modalContent}
//             initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
//             onClick={e => e.stopPropagation()}
//         >
//             <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
            
//             <div className={styles.modalHeader}>
//                 <img src={invite.thumbnailUrl || '/default-event.jpg'} alt="banner" />
//                 <div className={styles.headerOverlay}>
//                     <h2>{invite.title}</h2>
//                 </div>
//             </div>

//             <div className={styles.modalBody}>
//                 <div className={styles.infoGrid}>
//                     <div className={styles.infoItem}>
//                         <User className={styles.icon} />
//                         <div><label>Nhà tổ chức</label><p>{invite.creatorName}</p></div>
//                     </div>
//                     <div className={styles.infoItem}>
//                         <Calendar className={styles.icon} />
//                         <div><label>Thời gian</label><p>{new Date(invite.startTime).toLocaleDateString()} - {new Date(invite.endTime).toLocaleDateString()}</p></div>
//                     </div>
//                     <div className={styles.infoItem}>
//                         <Trophy className={styles.icon} />
//                         <div><label>Tổng giải thưởng</label><p>{invite.totalPrizePool?.toLocaleString()} đ</p></div>
//                     </div>
//                     <div className={styles.infoItem}>
//                         <Users className={styles.icon} />
//                         <div><label>Người tham gia</label><p>{invite.participantCount} bài dự thi</p></div>
//                     </div>
//                 </div>

//                 <div className={styles.section}>
//                     <h3><Info size={16} /> Nội dung sự kiện</h3>
//                     <p>{invite.description}</p>
//                 </div>

//                 {invite.prizes && invite.prizes.length > 0 && (
//                     <div className={styles.section}>
//                         <h3><Trophy size={16} /> Cơ cấu giải thưởng</h3>
//                         <div className={styles.expertTags}>
//                             {invite.prizes.map((p, idx) => (
//                                 <span key={idx} className={styles.tag}>
//                                     Hạng {p.ranked}: {p.rewardAmount?.toLocaleString()} đ
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {!isHistory && (
//                 <div className={styles.modalActions}>
//                     <button className={styles.btnDecline} onClick={() => onDecline(invite.eventId)}>Từ chối</button>
//                     <button className={styles.btnAccept} onClick={() => onAccept(invite.eventId)}>Đồng ý tham gia</button>
//                 </div>
//             )}
//         </motion.div>
//     </motion.div>
// );

// export default ExpertInvitations;