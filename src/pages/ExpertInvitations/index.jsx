import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, Calendar, User, Check, X, History, 
    Clock, MapPin, Trophy, Users, Info 
} from 'lucide-react';
import { MOCK_INVITES } from '@/features/invitations/data/mockInvites';
import styles from './ExpertInvitations.module.scss';

const ExpertInvitations = () => {
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'
    const [selectedInvite, setSelectedInvite] = useState(null);

    const filteredInvites = MOCK_INVITES.filter(invite => 
        activeTab === 'pending' ? invite.status === 'pending' : invite.status !== 'pending'
    );

    const handleAccept = (id) => {
        console.log("Accepted invitation:", id);
        // Sau này gọi API ở đây
        setSelectedInvite(null);
    };

    const handleDecline = (id) => {
        console.log("Declined invitation:", id);
        // Sau này gọi API ở đây
        setSelectedInvite(null);
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
                        {MOCK_INVITES.filter(i => i.status === 'pending').length > 0 && (
                            <span className={styles.badge}>
                                {MOCK_INVITES.filter(i => i.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button 
                        className={activeTab === 'history' ? styles.active : ''} 
                        onClick={() => setActiveTab('history')}
                    >
                        <History size={16} /> Lịch sử
                    </button>
                </div>
            </header>

            <main className={styles.content}>
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={styles.grid}
                    >
                        {filteredInvites.length > 0 ? (
                            filteredInvites.map(invite => (
                                <InvitationCard 
                                    key={invite.id} 
                                    invite={invite} 
                                    isHistory={activeTab === 'history'}
                                    onViewDetail={() => setSelectedInvite(invite)}
                                    onAccept={handleAccept}
                                    onDecline={handleDecline}
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
            </main>

            {/* Modal chi tiết */}
            <AnimatePresence>
                {selectedInvite && (
                    <InvitationDetailModal 
                        invite={selectedInvite} 
                        onClose={() => setSelectedInvite(null)} 
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sub-components ---

const InvitationCard = ({ invite, isHistory, onViewDetail, onAccept, onDecline }) => (
    <div className={styles.card} onClick={onViewDetail}>
        <div className={styles.banner}>
            <img src={invite.banner} alt="event" />
            <div className={`${styles.statusBadge} ${styles[invite.status]}`}>
                {invite.status === 'pending' ? 'Mới' : invite.status.toUpperCase()}
            </div>
        </div>
        
        <div className={styles.cardBody}>
            <h3 className={styles.eventTitle}>{invite.eventTitle}</h3>
            
            <div className={styles.meta}>
                <span><User size={14} /> {invite.organizer}</span>
                <span><Calendar size={14} /> {new Date(invite.startDate).toLocaleDateString()}</span>
            </div>

            <p className={styles.description}>{invite.description}</p>

            {!isHistory ? (
                <div className={styles.actions} onClick={e => e.stopPropagation()}>
                    <button onClick={() => onDecline(invite.id)} className={styles.btnDecline}>
                        Từ chối
                    </button>
                    <button onClick={() => onAccept(invite.id)} className={styles.btnAccept}>
                        Chấp nhận
                    </button>
                </div>
            ) : (
                <div className={styles.historyFooter}>
                    <Check size={14} /> Đã xử lý lời mời
                </div>
            )}
        </div>
    </div>
);

const InvitationDetailModal = ({ invite, onClose, onAccept, onDecline }) => (
    <motion.div 
        className={styles.modalOverlay}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
    >
        <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
        >
            <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
            
            <div className={styles.modalHeader}>
                <img src={invite.banner} alt="banner" />
                <div className={styles.headerOverlay}>
                    <h2>{invite.eventTitle}</h2>
                </div>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <User className={styles.icon} />
                        <div><label>Nhà tổ chức</label><p>{invite.organizer}</p></div>
                    </div>
                    <div className={styles.infoItem}>
                        <Calendar className={styles.icon} />
                        <div><label>Thời gian</label><p>{new Date(invite.startDate).toLocaleDateString()} - {new Date(invite.endDate).toLocaleDateString()}</p></div>
                    </div>
                    <div className={styles.infoItem}>
                        <MapPin className={styles.icon} />
                        <div><label>Địa điểm</label><p>{invite.location || "Online"}</p></div>
                    </div>
                    <div className={styles.infoItem}>
                        <Trophy className={styles.icon} />
                        <div><label>Vai trò Expert</label><p>{invite.role}</p></div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3><Info size={16} /> Nội dung lời mời</h3>
                    <p>{invite.description}</p>
                </div>

                {invite.otherExperts && (
                    <div className={styles.section}>
                        <h3><Users size={16} /> Experts cùng tham gia</h3>
                        <div className={styles.expertTags}>
                            {invite.otherExperts.map(ex => <span key={ex} className={styles.tag}>{ex}</span>)}
                        </div>
                    </div>
                )}
            </div>

            {invite.status === 'pending' && (
                <div className={styles.modalActions}>
                    <button className={styles.btnDecline} onClick={() => onDecline(invite.id)}>Từ chối</button>
                    <button className={styles.btnAccept} onClick={() => onAccept(invite.id)}>Đồng ý tham gia</button>
                </div>
            )}
        </motion.div>
    </motion.div>
);

export default ExpertInvitations;