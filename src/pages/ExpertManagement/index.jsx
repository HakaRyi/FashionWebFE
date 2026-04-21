import { useState, useMemo, useCallback } from "react";
import {
    ExpertFilter,
    ExpertTable,
    ExpertModal,
    expertApi,
    useExperts
} from "@/features/expert";
import { toast } from "react-toastify";
import styles from "./ExpertManagement.module.scss";

function ExpertManagementPage() {
    const { experts, loading, fetchExperts } = useExperts();

    // --- States ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest");
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    // --- Logic Lọc & Sắp xếp (Memoized) ---
    const filteredExperts = useMemo(() => {
        return experts
            .filter(exp => {
                const latestRequest = exp.expertRequests?.[0];
                const name = exp.account?.userName || exp.userName || "";
                const field = exp.expertiseField || "";

                const matchesSearch =
                    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    field.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus = statusFilter === "All" || latestRequest?.status === statusFilter;

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
            });
    }, [experts, searchTerm, statusFilter, sortOrder]);

    // --- Logic Phân trang ---
    const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
    const currentTableData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredExperts.slice(start, start + itemsPerPage);
    }, [filteredExperts, currentPage]);

    // --- Handlers ---
    const handleFilterChange = useCallback((type, value) => {
        if (type === 'search') setSearchTerm(value);
        if (type === 'status') setStatusFilter(value);
        if (type === 'sort') setSortOrder(value);
        setCurrentPage(1); // Luôn reset về trang 1 khi lọc
    }, []);

    const handleApprove = async (exp) => {
        const fileId = exp.expertRequests?.[0]?.expertFileId;

        if (!fileId) return toast.error("The file number was not found!");

        const loadId = toast.loading("Establishing expert rights...");
        try {
            await expertApi.processApplication(fileId, "Approved", "The application is complete and valid.");

            toast.update(loadId, {
                render: `Expert rights granted to ${exp.userName || 'user'}!`,
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            setSelectedExpert(null);
            fetchExperts();
        } catch (err) {
            toast.update(loadId, {
                render: `Error: ${err.response?.data?.message || "Cannot approve"}`,
                type: "error",
                isLoading: false,
                autoClose: 4000
            });
        }
    };

    const handleReject = async (exp) => {
        if (!rejectReason.trim()) {
            return toast.warning("You must enter a reason for rejection to notify the user.");
        }

        const fileId = exp.expertRequests?.[0]?.expertFileId;
        const loadId = toast.loading("Sending rejection feedback...");

        try {
            await expertApi.processApplication(fileId, "Rejected", rejectReason);

            toast.update(loadId, {
                render: "Rejected and notification sent to the applicant.",
                type: "info",
                isLoading: false,
                autoClose: 3000
            });

            setRejectReason("");
            setSelectedExpert(null);
            fetchExperts();
        } catch (err) {
            toast.update(loadId, {
                render: `Error: ${err.response?.data?.message || "Failed to perform action"}`,
                type: "error",
                isLoading: false,
                autoClose: 4000
            });
        }
    };

    // --- Render ---
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <h2>Expert Management</h2>
                <div className={styles.stats}>
                    <strong>{filteredExperts.length}</strong> experts found
                </div>
            </header>

            <ExpertFilter
                searchTerm={searchTerm}
                setSearchTerm={(val) => handleFilterChange('search', val)}
                statusFilter={statusFilter}
                setStatusFilter={(val) => handleFilterChange('status', val)}
                sortOrder={sortOrder}
                setSortOrder={(val) => handleFilterChange('sort', val)}
                refresh={() => {
                    fetchExperts();
                    setCurrentPage(1);
                    toast.info("Data refreshed");
                }}
            />

            <div className={styles.tableContainer}>
                {loading ? (
                    <div className={styles.empty}>Loading data...</div>
                ) : filteredExperts.length > 0 ? (
                    <>
                        <ExpertTable
                            experts={currentTableData}
                            onView={setSelectedExpert}
                        />

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={currentPage === index + 1 ? styles.activePage : ""}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.empty}>No matching experts found.</div>
                )}
            </div>

            <ExpertModal
                expert={selectedExpert}
                onClose={() => {
                    setSelectedExpert(null);
                    setRejectReason("");
                }}
                onApprove={handleApprove}
                onReject={handleReject}
                rejectReason={rejectReason}
                setRejectReason={setRejectReason}
            />
        </div>
    );
}

export default ExpertManagementPage;