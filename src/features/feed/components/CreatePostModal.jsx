import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Loader2, Plus, AlertCircle, Calendar, Banknote } from 'lucide-react';
import styles from '../styles/CreatePostModal.module.scss';
import { feedApi } from '@/features/feed/api/feed';
import { useEventStore } from '@/features/events';
import { useWallet, DepositModal } from '@/features/wallet';

const CreatePostModal = ({
    isOpen,
    onClose,
    onSuccess,
    user,
    // Nếu có fixedEventId -> Chế độ tham gia Event
    // Nếu không có -> Chế độ post bình thường
    fixedEventId = null,
    eventName = "",
    entryFee = 0,
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const fileInputRef = useRef(null);
    const fetchEvents = useEventStore(state => state.fetchEvents);
    const { stats, loading: walletLoading, refreshData: refreshWallet } = useWallet({ enabled: !!fixedEventId && isOpen });

    const currentBalance = useMemo(() => {
        if (!stats || !Array.isArray(stats)) return 0;

        const balanceStat = stats.find(s => {
            const label = s.label?.toLowerCase() || "";
            return (
                label.includes("balance") ||
                label.includes("ví") ||
                label.includes("số dư") ||
                s.isMainBalance === true
            );
        });

        return balanceStat ? balanceStat.value : 0;
    }, [stats]);

    const isInsufficientBalance = fixedEventId && entryFee > 0 && currentBalance < entryFee;

    useEffect(() => {
        if (!isInsufficientBalance && error === "Insufficient balance to join this event.") {
            setError(null);
        }
    }, [isInsufficientBalance, error]);

    useEffect(() => {
        if (isOpen && fixedEventId) {
            refreshWallet();
        } else {
            setTitle('');
            setContent('');
            setImages([]);
            setPreviews([]);
            setError(null);
        }
    }, [isOpen, fixedEventId, refreshWallet]);

    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if (validFiles.length > 0) {
            setImages(prev => [...prev, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(previews[index]);
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isInsufficientBalance) {
            setError("Insufficient balance to join this event.");
            return;
        }

        const hasContent = content.trim().length > 0;
        const hasImages = images.length > 0;

        if (!hasContent || !hasImages) {
            setError('Please add some text content or at least one image.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        if (title) formData.append('Title', title);
        if (content) formData.append('Content', content);
        if (fixedEventId) formData.append('EventId', fixedEventId);

        images.forEach(file => formData.append('Images', file));

        try {
            await feedApi.createPost(formData);

            if (fixedEventId) {
                await fetchEvents(true);
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                        <motion.div
                            className={styles.modalContainer}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        // onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.header}>
                                <h2>{fixedEventId ? 'Participate in Event' : 'Create New Post'}</h2>
                                <button type="button" className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.formBody}>
                                <div className={styles.userInfo}>
                                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`} alt="avatar" />
                                    <div className={styles.userMeta}>
                                        <span className={styles.name}>{user?.username || 'User'}</span>

                                        {fixedEventId && (
                                            <div className={styles.eventBadge}>
                                                <Calendar size={12} />
                                                <span>Submitting to: <strong>{eventName || 'Event'}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {fixedEventId && entryFee > 0 && (
                                    <div className={`${styles.walletCheck} ${isInsufficientBalance ? styles.insufficient : styles.sufficient}`}>
                                        <div className={styles.feeInfo}>
                                            <div className={styles.label}>
                                                <Banknote size={16} />
                                                <span>Entry Fee: <strong>{entryFee.toLocaleString('vi-VN')} VND</strong></span>
                                            </div>
                                            <div className={styles.yourBalance}>
                                                Your Balance: {currentBalance.toLocaleString('vi-VN')} VND
                                            </div>
                                        </div>

                                        {isInsufficientBalance && (
                                            <div className={styles.warningAction}>
                                                <small>You need {(entryFee - currentBalance).toLocaleString('vi-VN')} VND more</small>
                                                <button
                                                    type="button"
                                                    className={styles.depositBtn}
                                                    onClick={() => setIsDepositOpen(true)}
                                                >
                                                    Top Up Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="Give your post a title..."
                                    className={styles.titleInput}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isInsufficientBalance}
                                />

                                <textarea
                                    placeholder={fixedEventId ? "Tell us about your event entry..." : "Share your fashion thoughts..."}
                                    className={styles.textarea}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={isInsufficientBalance}
                                />

                                {/* Image Previews */}
                                {previews.length > 0 && (
                                    <div className={styles.imageGrid}>
                                        {previews.map((src, i) => (
                                            <div key={i} className={styles.previewCard}>
                                                <img src={src} alt="preview" />
                                                <button type="button" onClick={() => removeImage(i)}><X size={14} /></button>
                                            </div>
                                        ))}
                                        <button type="button" className={styles.addMoreBtn} onClick={() => fileInputRef.current.click()}>
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                )}

                                {error && <div className={styles.errorMsg}><AlertCircle size={16} /> {error}</div>}

                                <div className={styles.footer}>
                                    <button
                                        type="button"
                                        className={styles.addImgBtn}
                                        onClick={() => fileInputRef.current.click()}
                                        disabled={isSubmitting || isInsufficientBalance}
                                    >
                                        <ImageIcon size={20} />
                                        <span>Add Photos</span>
                                    </button>
                                    <input type="file" hidden multiple ref={fileInputRef} onChange={handleImageChange} accept="image/*" />

                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                        disabled={
                                            isSubmitting ||
                                            !content.trim() || images.length === 0
                                        }
                                    >
                                        {isSubmitting ? <Loader2 className={styles.spin} size={18} /> :
                                            isInsufficientBalance ? 'Insufficient Balance' : 'Post Now'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {isDepositOpen && (
                <DepositModal
                    isOpen={isDepositOpen}
                    onClose={() => setIsDepositOpen(false)}
                    amount={entryFee - currentBalance}
                    isFixedAmount={false}
                    onRefreshBalance={refreshWallet}
                />
            )}
        </>
    );
};

export default CreatePostModal;