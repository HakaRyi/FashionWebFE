import React from 'react';
import { ShieldAlert, Star, BookOpen, AlertCircle, TrendingDown, CheckCircle, RotateCcw } from 'lucide-react';
import styles from './Policy.module.scss';

const Policy = () => {
  // Dữ liệu đồng bộ với logic Backend
  const penaltyRules = [
    { id: 1, action: "Chấm thiếu dưới 10% số lượng bài thi", points: "-2 điểm", type: "Nhắc nhở" },
    { id: 2, action: "Chấm thiếu từ 10% - 50% số lượng bài thi", points: "-10 điểm", type: "Vi phạm" },
    { id: 3, action: "Bỏ dở trên 50% số lượng bài thi", points: "-20 điểm", type: "Vi phạm nặng" },
    { id: 4, action: "Không thực hiện bất kỳ lượt chấm nào", points: "-30 điểm", type: "Nghiêm trọng" },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chính sách Uy tín Chuyên gia</h1>
        <p>Hệ thống tự động đánh giá trách nhiệm và năng lực giám khảo</p>
      </header>

      <div className={styles.grid}>
        {/* Hệ thống điểm */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Star className={styles.iconGold} />
            <h3>Chỉ số Uy tín</h3>
          </div>
          <div className={styles.content}>
            <p>Điểm uy tín mặc định là <strong>100</strong>. Chỉ số này phản ánh sự chuyên nghiệp của bạn.</p>
            <div className={styles.miniFeature}>
              <CheckCircle size={16} /> <span><b>Thưởng:</b> +5 điểm khi hoàn thành 100% bài chấm trong sự kiện.</span>
            </div>
            <div className={styles.miniFeature}>
              <CheckCircle size={16} /> <span><b>Quyền lợi:</b> Điểm cao giúp tăng trọng số đánh giá bài viết.</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `100%` }}></div>
          </div>
        </div>

        {/* Cơ chế phục hồi */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <RotateCcw className={styles.iconBlue} />
            <h3>Cơ chế Phục hồi</h3>
          </div>
          <div className={styles.content}>
            <p>Hệ thống luôn tạo điều kiện để chuyên gia cải thiện chỉ số uy tín thông qua trách nhiệm:</p>
            <ul className={styles.listList}>
              <li>Tự động phục hồi điểm sau mỗi sự kiện hoàn thành xuất sắc.</li>
              <li>Tích lũy điểm uy tín để nhận danh hiệu "Chuyên gia tin cậy".</li>
              <li>Điểm thấp chỉ làm giảm thứ hạng đề xuất, không ảnh hưởng quyền truy cập.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className={styles.policySection}>
        <div className={styles.sectionTitle}>
          <ShieldAlert />
          <h2>Khung khấu trừ điểm trách nhiệm</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hành vi (Dựa trên tỷ lệ hoàn thành)</th>
                <th>Phân loại</th>
                <th>Mức khấu trừ</th>
              </tr>
            </thead>
            <tbody>
              {penaltyRules.map(rule => (
                <tr key={rule.id}>
                  <td>{rule.action}</td>
                  <td><span className={styles.badge}>{rule.type}</span></td>
                  <td className={styles.penaltyScore}>
                    <TrendingDown size={14} /> {rule.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.note}>
          <AlertCircle size={24} />
          <div>
            <strong>Cam kết từ hệ thống:</strong>
            <p>
              Chúng tôi <b>không thực hiện khóa hay đình chỉ</b> tài khoản chuyên gia vì lý do chấm thiếu bài. Tuy nhiên, nếu điểm uy tín quá thấp, hệ thống sẽ hạn chế tần suất gửi lời mời tham gia các sự kiện lớn để đảm bảo công bằng cho thí sinh.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Policy;