import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Coins,
    Image as ImageIcon,
    Trophy,
    ChevronRight,
    X,
    Sparkles,
    Plus,
    Wallet,
    AlertCircle,
    Settings2,
    CheckCircle2,
} from 'lucide-react';
import styles from './CreateEvent.module.scss';
import DatePicker from 'react-datepicker';
import eventService from '../../services/eventService';
import DepositModal from '../../components/events/DepositModal/DepositModal';
import PrizeManager from '../../components/events/PrizeManager/PrizeManager';
import VotingManager from '../../components/events/VotingManager/VotingManager';

const CreateEvent = () => {
    const [form, setForm] = useState({ 
        title: '', 
        description: '', 
        image: null,
        expertWeight: 70 
    });
    
    const [prizes, setPrizes] = useState([
        { label: 'Giải Nhất', amount: 300 },
        { label: 'Giải Nhì', amount: 150 },
    ]);
    
    const [hashtags, setHashtags] = useState(['#StyleChallenge']);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    const [expertBalance, setExpertBalance] = useState(2500);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState(1000);
    const [isSuccess, setIsSuccess] = useState(false);

    const fileInputRef = useRef(null);

    const totalBudget = prizes.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const isOverBudget = totalBudget > expertBalance;

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
    };

    return (
        <div className={styles.container}>
            {/* NAVIGATION HEADER */}
            <header className={styles.mainNav}>
                <div className={styles.brand}>
                    <Sparkles className={styles.goldIcon} />
                    <span>Expert Studio</span>
                </div>
                <div className={styles.balanceStatus}>
                    <Wallet size={16} />
                    <span>
                        Số dư: <strong>{expertBalance.toLocaleString()}</strong> Coins
                    </span>
                </div>
            </header>

            <main className={styles.workspace}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.editorGrid}
                >
                    {/* CỘT TRÁI: MEDIA & CONTENT */}
                    <section className={styles.leftCol}>
                        <div className={styles.mediaBox} onClick={() => fileInputRef.current.click()}>
                            {form.image ? (
                                <img src={form.image} alt="Preview" />
                            ) : (
                                <div className={styles.placeholder}>
                                    <ImageIcon size={40} />
                                    <p>Tải lên ảnh bìa sự kiện</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                onChange={(e) => {
                                    if(e.target.files[0]) {
                                        setForm({ ...form, image: URL.createObjectURL(e.target.files[0]) });
                                    }
                                }}
                            />
                            <div className={styles.floatBadge}>LIVE PREVIEW</div>
                        </div>

                        <div className={styles.textFields}>
                            <input
                                className={styles.titleInput}
                                placeholder="Tên chiến dịch sự kiện..."
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                            <textarea
                                className={styles.descInput}
                                placeholder="Nội dung thử thách dành cho cộng đồng..."
                                rows="4"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </section>

                    {/* CỘT PHẢI: CONFIGURATION */}
                    <section className={styles.rightCol}>
                        {/* 1. DATE PICKER */}
                        <div className={styles.dateTimeGrid}>
                            <div className={styles.inputGroup}>
                                <label>Bắt đầu</label>
                                <div className={styles.pickerWrapper}>
                                    <Settings2 size={14} className={styles.prefixIcon} />
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        showTimeSelect
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        minDate={new Date()}
                                        filterTime={filterPassedTime}
                                        className={styles.customDatePicker}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Kết thúc</label>
                                <div className={styles.pickerWrapper}>
                                    <Settings2 size={14} className={styles.prefixIcon} />
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        showTimeSelect
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        minDate={startDate}
                                        className={styles.customDatePicker}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. COMPONENT QUẢN LÝ GIẢI THƯỞNG */}
                        <PrizeManager 
                            prizes={prizes} 
                            setPrizes={setPrizes} 
                            totalBudget={totalBudget}
                            isOverBudget={isOverBudget}
                        />

                        {/* 3. COMPONENT TRỌNG SỐ CHẤM ĐIỂM */}
                        <VotingManager 
                            expertWeight={form.expertWeight} 
                            setWeight={(val) => setForm({ ...form, expertWeight: val })}
                        />

                        {/* 4. HASHTAGS (Giữ lại do logic đơn giản) */}
                        <div className={styles.hashtagCard}>
                            <label>Hashtags chiến dịch</label>
                            <div className={styles.tagBox}>
                                {hashtags.map((tag) => (
                                    <span key={tag}>
                                        {tag}
                                        <Plus 
                                            size={12} 
                                            style={{ transform: 'rotate(45deg)', cursor: 'pointer' }}
                                            onClick={() => setHashtags(hashtags.filter((t) => t !== tag))} 
                                        />
                                    </span>
                                ))}
                                <input
                                    placeholder="#add..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            setHashtags([...hashtags, `#${e.target.value.replace('#', '')}`]);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </section>
                </motion.div>
            </main>

            {/* ACTION BAR FOOTER */}
            <footer className={styles.actionBar}>
                <div className={styles.info}>
                    {isOverBudget && (
                        <span className={styles.errorText}>
                            <AlertCircle size={16} />
                            Vượt quá ngân sách (Thiếu {(totalBudget - expertBalance).toLocaleString()} Coins)
                        </span>
                    )}
                </div>

                <div className={styles.actions}>
                    {isOverBudget && (
                        <button className={styles.btnDeposit} onClick={() => setIsDepositOpen(true)}>
                            <Plus size={16} /> Nạp thêm Coin
                        </button>
                    )}
                    <button className={styles.btnPrimary} disabled={isOverBudget || !form.title}>
                        Khai mạc sự kiện <ChevronRight size={18} />
                    </button>
                </div>
            </footer>

            {/* MODAL NẠP TIỀN */}
            {isDepositOpen && (
                <DepositModal
                    isSuccess={isSuccess}
                    setIsSuccess={setIsSuccess}
                    amount={depositAmount}
                    setAmount={setDepositAmount}
                    onClose={() => setIsDepositOpen(false)}
                />
            )}
        </div>
    );
};

export default CreateEvent;
