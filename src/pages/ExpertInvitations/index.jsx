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