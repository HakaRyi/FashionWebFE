import { Plus, Calendar, Image as ImageIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import styles from "../../styles/CreateEventForm.module.scss";

const StepBasicInfo = ({
    form, setForm,
    startDate, setStartDate,
    endDate, setEndDate,
    previewUrl,
    fileInputRef,
    handleUploadClick,
    handleFileChange
}) => {
    const now = new Date();

    // Mốc 1: 24h kể từ bây giờ (cho Ngày bắt đầu)
    const minStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Mốc 2: 24h kể từ Ngày bắt đầu (cho Ngày kết thúc)
    // Nếu chưa chọn startDate thì mặc định là minStart + 24h
    const minEnd = startDate
        ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date(minStart.getTime() + 24 * 60 * 60 * 1000);

    // Hàm chặn giờ cho Ngày bắt đầu (chỉ chặn nếu đang chọn đúng ngày minStart)
    const filterStartTime = (date) => {
        const isSameDay = date.toDateString() === minStart.toDateString();
        return isSameDay ? date.getTime() >= minStart.getTime() : true;
    };

    // Hàm chặn giờ cho Ngày kết thúc (chỉ chặn nếu đang chọn đúng ngày minEnd)
    const filterEndTime = (date) => {
        const isSameDay = date.toDateString() === minEnd.toDateString();
        return isSameDay ? date.getTime() >= minEnd.getTime() : true;
    };
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Thông tin cơ bản</h2>

            {/* TITLE */}
            <div className={styles.inputGroup}>
                <label>Tiêu đề sự kiện</label>
                <input
                    type="text"
                    placeholder="VD: Hackathon Global 2026"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />
            </div>

            {/* DATE */}
            <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                    <label>
                        <Calendar size={14} /> Ngày bắt đầu
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            // Nếu chọn startDate mới mà endDate cũ không còn hợp lệ (vi phạm 24h), reset endDate
                            if (endDate && endDate.getTime() < date.getTime() + 24 * 60 * 60 * 1000) {
                                setEndDate(null);
                            }
                        }}
                        minDate={minStart}
                        filterTime={filterStartTime} // Chặn giờ cụ thể
                        showTimeSelect
                        dateFormat="dd/MM/yyyy h:mm aa"
                        placeholderText="Sau 24h tính từ bây giờ"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>
                        <Calendar size={14} /> Ngày kết thúc
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        minDate={minEnd}
                        filterTime={filterEndTime}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy h:mm aa"
                        placeholderText="Sau ngày bắt đầu 24h"
                        disabled={!startDate}
                    />
                </div>
            </div>

            {/* BANNER */}
            <div className={styles.inputGroup}>
                <label>
                    <ImageIcon size={14} /> Ảnh bìa (Banner)
                </label>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept="image/*"
                />

                <div
                    className={styles.dropzone}
                    onClick={handleUploadClick}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Banner Preview"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                    ) : (
                        <>
                            <Plus size={24} />
                            <span>Kéo thả hoặc click để tải ảnh</span>
                        </>
                    )}
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className={styles.inputGroup}>
                <label>Mô tả chi tiết</label>
                <textarea
                    rows={6}
                    placeholder="Chia sẻ về mục đích, thể lệ cuộc thi..."
                    value={form.description || ""}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </div>
        </section>
    );
};

export default StepBasicInfo;