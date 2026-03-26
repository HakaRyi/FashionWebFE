import { useState } from "react";
import { 
  ExpertFilter, 
  ExpertTable, 
  ExpertModal, 
  expertApi, 
  useExperts 
} from "@/features/expert";
import { toast } from "react-toastify";
import styles from "@/features/expert/styles/Expert.module.scss";

function ExpertManagementPage() {
  const { experts, loading, fetchExperts } = useExperts();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Logic lọc dữ liệu (Client-side)
  const processedExperts = experts.filter(exp => {
    const latestRequest = exp.expertRequests?.[0];
    const name = exp.account?.userName || exp.userName || "";
    const field = exp.expertiseField || "";
    
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || latestRequest?.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const handleApprove = async (exp) => {
    const latestRequest = exp.expertRequests?.[0];
    const fileId = latestRequest?.expertFileId;
    if (!fileId) return toast.error("Hồ sơ không có ID file!");

    const loadId = toast.loading("Đang xử lý phê duyệt...");
    try {
      await expertApi.processApplication(fileId, "Approved", "Hồ sơ hợp lệ");
      toast.update(loadId, { 
        render: "Đã phê duyệt chuyên gia thành công!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      setSelectedExpert(null);
      fetchExperts(); 
    } catch (err) {
      toast.update(loadId, { 
        render: `Lỗi: ${err.response?.data?.message || err.message}`, 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  const handleReject = async (exp) => {
    if (!rejectReason.trim()) return toast.warning("Vui lòng nhập lý do từ chối");
    
    const latestRequest = exp.expertRequests?.[0];
    const fileId = latestRequest?.expertFileId;
    const loadId = toast.loading("Đang xử lý từ chối...");
    try {
      await expertApi.processApplication(fileId, "Rejected", rejectReason);
      toast.update(loadId, { 
        render: "Đã từ chối hồ sơ chuyên gia.", 
        type: "info", 
        isLoading: false, 
        autoClose: 3000 
      });
      setRejectReason("");
      setSelectedExpert(null);
      fetchExperts();
    } catch (err) {
      toast.update(loadId, { 
        render: "Lỗi khi từ chối hồ sơ", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Quản lý Chuyên gia</h2>
        <div className={styles.stats}>
          <strong>{processedExperts.length}</strong> chuyên gia tìm thấy
        </div>
      </header>
      
      <ExpertFilter
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder} 
        setSortOrder={setSortOrder}
        refresh={() => {
          fetchExperts();
          toast.info("Đã làm mới dữ liệu");
        }}
      />

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.empty}>Đang tải dữ liệu...</div>
        ) : processedExperts.length > 0 ? (
          <ExpertTable experts={processedExperts} onView={setSelectedExpert} />
        ) : (
          <div className={styles.empty}>Không tìm thấy chuyên gia nào phù hợp.</div>
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