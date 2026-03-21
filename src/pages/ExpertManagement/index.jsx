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
    // Lưu ý: Kiểm tra kỹ cấu trúc data trả về từ API để tránh lỗi undefined
    const name = exp.account?.userName || exp.userName || "";
    const field = exp.expertiseField || "";
    
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || exp.expertFile?.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const handleApprove = async (exp) => {
    const fileId = exp.expertFile?.expertFileId;
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
    
    const fileId = exp.expertFile?.expertFileId;
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
// import React, { useState, useEffect } from 'react';
// import styles from './Expert.module.scss';
// import {
//     FaSearch, FaUserCheck, FaIdCard, FaSync, 
//     FaFilter, FaSortAmountDown, FaTimes, FaCalendarAlt
// } from 'react-icons/fa';
// import { expertApi } from '@/services/expertService';

// function ExpertManagement() {
//     const [experts, setExperts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedExpert, setSelectedExpert] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [rejectReason, setRejectReason] = useState("");

//     const [statusFilter, setStatusFilter] = useState("All");
//     const [sortOrder, setSortOrder] = useState("newest");

//     const fetchExperts = async () => {
//         setLoading(true);
//         try {
//             // Gọi API getAllExperts dựa trên endpoint bạn đã test thành công
//             const res = await expertApi.getAllExperts();
            
//             // Xử lý dữ liệu linh hoạt cho cả axios trả về res hoặc res.data
//             const actualData = res.data || res;
            
//             // Nếu API bọc trong $values (OData/Entity Framework) hoặc là array trực tiếp
//             const finalArray = actualData?.$values || (Array.isArray(actualData) ? actualData : []);
            
//             setExperts(finalArray);
//         } catch (error) {
//             console.error("Lỗi fetch:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchExperts();
//     }, []);

//     const handleReview = async (fileId, isApproved) => {
//         if (!fileId) return alert("Không tìm thấy ID hồ sơ");
        
//         const status = isApproved ? "Approved" : "Rejected";
//         const reason = isApproved ? "Hồ sơ hợp lệ" : rejectReason || "Không đủ điều kiện";
        
//         try {
//             await expertApi.processApplication(fileId, status, reason);
//             alert(isApproved ? "Phê duyệt thành công!" : "Đã từ chối hồ sơ.");
//             setRejectReason(""); 
//             fetchExperts();
//             setSelectedExpert(null);
//         } catch (error) {
//             alert("Lỗi xử lý: " + (error.response?.data?.message || "Không xác định"));
//         }
//     };

//     // --- Logic Xử lý Dữ liệu ---
//     const processedExperts = experts
//         .filter(exp => {
//             const userName = exp.account?.userName || "";
//             const expertise = exp.expertiseField || "";
            
//             const matchesSearch =
//                 expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 userName.toLowerCase().includes(searchTerm.toLowerCase());

//             const matchesStatus = statusFilter === "All" || exp.expertFile?.status === statusFilter;

//             return matchesSearch && matchesStatus;
//         })
//         .sort((a, b) => {
//             const dateA = new Date(a.createdAt);
//             const dateB = new Date(b.createdAt);
//             return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
//         });

//     return (
//         <div className={styles.wrapper}>
//             <div className={styles.header}>
//                 <h2>Hệ Thống Phê Duyệt Chuyên Gia</h2>
//                 <div className={styles.stats}>
//                     Tổng số: <b>{processedExperts.length}</b>
//                 </div>
//             </div>

//             <div className={styles.controlPanel}>
//                 <div className={styles.searchGroup}>
//                     <div className={styles.searchBox}>
//                         <FaSearch />
//                         <input
//                             placeholder="Tìm tên, chuyên môn..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <div className={styles.filterGroup}>
//                     <div className={styles.selectWrapper}>
//                         <FaFilter />
//                         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//                             <option value="All">Tất cả trạng thái</option>
//                             <option value="Pending">🕒 Đang chờ</option>
//                             <option value="Approved">✅ Đã duyệt</option>
//                             <option value="Rejected">❌ Từ chối</option>
//                         </select>
//                     </div>

//                     <div className={styles.selectWrapper}>
//                         <FaSortAmountDown />
//                         <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                             <option value="newest">Mới nhất</option>
//                             <option value="oldest">Cũ nhất</option>
//                         </select>
//                     </div>

//                     <button className={styles.btnSync} onClick={fetchExperts} title="Làm mới">
//                         <FaSync />
//                     </button>
//                 </div>
//             </div>

//             <div className={styles.tableContainer}>
//                 {loading ? <div className={styles.loader}>Đang tải...</div> : (
//                     <table className={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th>Chuyên gia</th>
//                                 <th>Chuyên môn</th>
//                                 <th>Ngày đăng ký</th>
//                                 <th>Trạng thái</th>
//                                 <th style={{ textAlign: 'center' }}>Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {processedExperts.length > 0 ? processedExperts.map((exp) => (
//                                 <tr key={exp.expertProfileId}>
//                                     <td className={styles.userCell}>
//                                         <div className={styles.avatar}>
//                                             {exp.account?.userName?.charAt(0) || exp.expertiseField?.charAt(0) || "E"}
//                                         </div>
//                                         <div>
//                                             <div className={styles.name}>
//                                                 {exp.account?.userName || `Expert #${exp.expertProfileId}`}
//                                             </div>
//                                             <div className={styles.sub}>{exp.styleAesthetic}</div>
//                                         </div>
//                                     </td>
//                                     <td>
//                                         <span className={styles.fieldBadge}>{exp.expertiseField}</span>
//                                         <div className={styles.expYear}>{exp.yearsOfExperience} năm kinh nghiệm</div>
//                                     </td>
//                                     <td>
//                                         <div className={styles.dateText}>
//                                             <FaCalendarAlt /> {new Date(exp.createdAt).toLocaleDateString('vi-VN')}
//                                         </div>
//                                     </td>
//                                     <td>
//                                         <span className={`${styles.statusBadge} ${styles[exp.expertFile?.status?.toLowerCase() || 'pending']}`}>
//                                             {exp.expertFile?.status || "Pending"}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         <div className={styles.actionBtns}>
//                                             <button className={styles.btnView} onClick={() => setSelectedExpert(exp)}>
//                                                 <FaIdCard /> Chi tiết
//                                             </button>
//                                             {exp.expertFile?.status === "Pending" && (
//                                                 <button 
//                                                     className={styles.btnQuickApprove} 
//                                                     onClick={() => handleReview(exp.expertFile?.expertFileId, true)}
//                                                     title="Phê duyệt nhanh"
//                                                 >
//                                                     <FaUserCheck />
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )) : (
//                                 <tr>
//                                     <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
//                                         Không tìm thấy dữ liệu chuyên gia.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 )}
//             </div>

//             {/* Modal Chi tiết hồ sơ */}
//             {selectedExpert && (
//                 <div className={styles.modalOverlay} onClick={() => setSelectedExpert(null)}>
//                     <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
//                         <div className={styles.modalHeader}>
//                             <h3>Chi tiết hồ sơ #{selectedExpert.expertProfileId}</h3>
//                             <button className={styles.btnClose} onClick={() => setSelectedExpert(null)}><FaTimes /></button>
//                         </div>
//                         <div className={styles.modalBody}>
//                             <div className={styles.infoSection}>
//                                 <h4>Thông tin cơ bản</h4>
//                                 <p><b>Bio:</b> {selectedExpert.bio || "Không có tiểu sử"}</p>
//                                 <p><b>Phong cách:</b> {selectedExpert.styleAesthetic}</p>
//                                 <p><b>Link minh chứng:</b> <a href={selectedExpert.expertFile?.licenseUrl} target="_blank" rel="noreferrer">Xem tại đây</a></p>
//                             </div>

//                             {selectedExpert.expertFile?.status === "Pending" && (
//                                 <div className={styles.approvalForm}>
//                                     <label>Lý do từ chối (nếu có):</label>
//                                     <textarea
//                                         value={rejectReason}
//                                         onChange={(e) => setRejectReason(e.target.value)}
//                                         placeholder="Nhập lý do để chuyên gia sửa đổi hồ sơ..."
//                                     />
//                                     <div className={styles.modalActions}>
//                                         <button className={styles.btnReject} onClick={() => handleReview(selectedExpert.expertFile?.expertFileId, false)}>Từ chối</button>
//                                         <button className={styles.btnApprove} onClick={() => handleReview(selectedExpert.expertFile?.expertFileId, true)}>Phê duyệt ngay</button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ExpertManagement;