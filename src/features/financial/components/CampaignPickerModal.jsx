import React, { useState, useMemo, useDeferredValue, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight, Hash, CheckCircle2, LayoutGrid, Info } from 'lucide-react';
import styles from '../styles/CampaignPickerModal.module.scss';

const ITEMS_PER_PAGE = 5;

const CampaignPickerModal = ({ isOpen, onClose, events = [], onSelect, selectedId }) => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const deferredSearch = useDeferredValue(search);

    // Filter logic
    const filteredEvents = useMemo(() => {
        const term = deferredSearch.toLowerCase();
        return events.filter(e => 
            e.title?.toLowerCase().includes(term) ||
            e.eventId?.toString().includes(term)
        );
    }, [events, deferredSearch]);

    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
    
    const displayEvents = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEvents, page]);

    // Reset page khi search
    useEffect(() => setPage(1), [deferredSearch]);

    // Chặn scroll body khi modal mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Đóng bằng phím ESC
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSelect = useCallback((id) => {
        onSelect(id);
        onClose();
    }, [onSelect, onClose]);

    if (!isOpen && !selectedId) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.modalOverlay}>
                    <motion.div 
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div 
                        className={styles.pickerContainer}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <header className={styles.header}>
                            <div className={styles.titleSection}>
                                <div className={styles.iconWrapper}>
                                    <LayoutGrid size={20} />
                                </div>
                                <div>
                                    <h3>Select Campaign</h3>
                                    <p>Filter data by specific event</p>
                                </div>
                            </div>
                            <button className={styles.closeIconButton} onClick={onClose} aria-label="Close">
                                <X size={20} />
                            </button>
                        </header>

                        <div className={styles.searchContainer}>
                            <div className={styles.searchWrapper}>
                                <Search className={styles.searchIcon} size={18} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search name or Campaign ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button className={styles.clearBtn} onClick={() => setSearch('')}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.scrollArea}>
                            <div className={styles.pickerGrid}>
                                <div
                                    className={`${styles.eventCard} ${!selectedId ? styles.isSelected : ''}`}
                                    onClick={() => handleSelect('')}
                                >
                                    <div className={styles.cardInfo}>
                                        <strong>All Campaigns</strong>
                                        <span>Show combined financial overview</span>
                                    </div>
                                    {!selectedId && <CheckCircle2 className={styles.checkIcon} size={20} />}
                                </div>

                                {displayEvents.map(ev => (
                                    <div
                                        key={ev.eventId}
                                        className={`${styles.eventCard} ${selectedId === ev.eventId ? styles.isSelected : ''}`}
                                        onClick={() => handleSelect(ev.eventId)}
                                    >
                                        <div className={styles.cardInfo}>
                                            <strong title={ev.title}>{ev.title}</strong>
                                            <span className={styles.eventId}>
                                                <Hash size={12} /> {ev.eventId}
                                            </span>
                                        </div>
                                        {selectedId === ev.eventId && (
                                            <CheckCircle2 className={styles.checkIcon} size={20} />
                                        )}
                                    </div>
                                ))}

                                {filteredEvents.length === 0 && (
                                    <div className={styles.emptySearch}>
                                        <Info size={32} />
                                        <p>No campaigns found for "<b>{search}</b>"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <footer className={styles.footer}>
                            <div className={styles.stats}>
                                Showing {displayEvents.length} of {filteredEvents.length}
                            </div>
                            
                            <div className={styles.pagination}>
                                <button 
                                    disabled={page === 1} 
                                    onClick={() => setPage(p => p - 1)}
                                    className={styles.navBtn}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                
                                <div className={styles.pageIndicator}>
                                    <span>{page}</span> / {totalPages}
                                </div>

                                <button 
                                    disabled={page === totalPages} 
                                    onClick={() => setPage(p => p + 1)}
                                    className={styles.navBtn}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(CampaignPickerModal);