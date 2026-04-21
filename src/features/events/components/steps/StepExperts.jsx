import { Search, Loader2, AlertCircle, Percent, Share2, ThumbsUp, ChevronLeft, ChevronRight, Award } from "lucide-react";
import styles from "../../styles/StepExperts.module.scss";
import { useExperts } from "@/features/expert";
import { useEffect, useState, useMemo } from "react";

const ITEMS_PER_PAGE = 6; // Số lượng expert trên mỗi trang

const StepExperts = ({ invitedExpertIds, toggleExpert, form, setForm }) => {
    const { activeExperts, loading, error, fetchActiveExperts } = useExperts();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchActiveExperts();
    }, []);

    // Reset về trang 1 khi tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleWeightChange = (e) => {
        const value = parseInt(e.target.value);
        setForm(prev => ({ ...prev, expertWeight: value }));
    };

    const handlePointChange = (field, value) => {
        // Chỉ cho phép nhập số dương
        const val = Math.max(0, Number(value));
        setForm(prev => ({ ...prev, [field]: val }));
    };

    // Filter experts dựa trên search
    const filteredExperts = useMemo(() => {
        return activeExperts.filter((ex) =>
            ex.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ex.expertiseField?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeExperts, searchTerm]);

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredExperts.length / ITEMS_PER_PAGE);
    const paginatedExperts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredExperts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredExperts, currentPage]);

    if (error) {
        return (
            <div className={styles.errorBox}>
                <AlertCircle size={20} />
                <span>Unable to load the list of experts.</span>
            </div>
        );
    }

    return (
        <section className={styles.section}>
            <header className={styles.header}>
                <h2 className={styles.sectionTitle}>Expert Panel</h2>
                <p className={styles.sectionSub}>Select experts to participate in judging and configure weights</p>
            </header>

            {/* Config Trọng số & Điểm thưởng */}
            <div className={styles.configGrid}>
                <div className={styles.weightCard}>
                    <div className={styles.cardHead}>
                        <Percent size={18} />
                        <h3>Scoring Weight</h3>
                    </div>
                    <div className={styles.sliderContainer}>
                        <div className={styles.sliderLabels}>
                            <span>Expert: <strong>{form.expertWeight}%</strong></span>
                            <span>User: <strong>{100 - form.expertWeight}%</strong></span>
                        </div>
                        <input
                            type="range" min="0" max="100" step="5"
                            value={form.expertWeight ?? 70}
                            onChange={handleWeightChange}
                            className={styles.rangeInput}
                        />
                    </div>
                </div>

                <div className={styles.pointsCard}>
                    <div className={styles.cardHead}>
                        <Share2 size={18} />
                        <h3>Interaction Points</h3>
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.pointField}>
                            <ThumbsUp size={14} />
                            <label>Each Like:</label>
                            <input
                                type="number"
                                min="0"
                                value={form.pointPerLike ?? 1}
                                onChange={(e) => handlePointChange("pointPerLike", e.target.value)}
                            />
                        </div>
                        <div className={styles.pointField}>
                            <Share2 size={14} />
                            <label>Each Share:</label>
                            <input
                                type="number"
                                min="0"
                                value={form.pointPerShare ?? 1}
                                onChange={(e) => handlePointChange("pointPerShare", e.target.value)}
                            />
                        </div>
                        <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                            * These points are used to calculate rankings based on community support.
                        </p>
                    </div>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* Thanh công cụ Tìm kiếm */}
            <div className={styles.searchBox}>
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search by name or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className={styles.countBadge}>
                    {filteredExperts.length} experts
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingCenter}><Loader2 className={styles.spinner} /></div>
            ) : (
                <>
                    <div className={styles.expertGrid}>
                        {paginatedExperts.map((ex) => {
                            const isSelected = invitedExpertIds.includes(ex.accountId);
                            return (
                                <div key={ex.expertProfileId} className={`${styles.expertCard} ${isSelected ? styles.selected : ""}`}>
                                    <img src={ex.avatarUrl || `https://ui-avatars.com/api/?name=${ex.userName}`} alt="avatar" />
                                    <div className={styles.exInfo}>
                                        <h4>{ex.userName}</h4>
                                        <span>{ex.expertiseField}</span>
                                        <small>{ex.yearsOfExperience} years of experience</small>
                                        <div className={styles.reputation}>
                                            <Award size={12} className={styles.reputationIcon} />
                                            <span>Reputation: <strong>{ex.reputationScore || 0}</strong></span>
                                        </div>
                                    </div>
                                    <button type="button"
                                        className={isSelected ? styles.btnInvited : styles.btnInvite}
                                        onClick={() => toggleExpert(ex.accountId)}
                                    >
                                        {isSelected ? "Selected" : "Invite"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Điều khiển phân trang */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className={styles.pageBtn}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className={styles.pageInfo}>
                                Page <strong>{currentPage}</strong> / {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className={styles.pageBtn}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default StepExperts;