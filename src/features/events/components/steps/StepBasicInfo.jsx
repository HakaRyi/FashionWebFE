import { Plus, Calendar, Image as ImageIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import styles from "../../styles/CreateEventForm.module.scss";

const StepBasicInfo = ({
    form, setForm,
    startDate, setStartDate,
    submissionDeadline, setSubmissionDeadline,
    endDate, setEndDate,
    previewUrl,
    fileInputRef,
    handleUploadClick,
    handleFileChange
}) => {
    const now = new Date();

    // Mốc 1: Ngày bắt đầu ít nhất sau 24h kể từ bây giờ
    const minStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Mốc 2: Hạn nộp bài ít nhất sau StartDate 1h
    const minSubmission = startDate
        ? new Date(startDate.getTime() + 1 * 60 * 60 * 1000)
        : minStart;

    // Mốc 3: Ngày kết thúc phải sau Hạn nộp bài đúng 24h
    const minEndLimit = submissionDeadline
        ? new Date(submissionDeadline.getTime() + 24 * 60 * 60 * 1000)
        : new Date(minSubmission.getTime() + 24 * 60 * 60 * 1000);

    // Hàm chặn giờ cho Ngày bắt đầu (chỉ chặn nếu đang chọn đúng ngày minStart)
    const filterStartTime = (date) => {
        const isSameDay = date.toDateString() === minStart.toDateString();
        return isSameDay ? date.getTime() >= minStart.getTime() : true;
    };

    // Hàm chặn giờ cho Ngày kết thúc (chỉ chặn nếu đang chọn đúng ngày minEnd)
    const filterEndTime = (date) => {
        const isSameDay = date.toDateString() === minEndLimit.toDateString();
        return isSameDay ? date.getTime() >= minEndLimit.getTime() : true;
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic information</h2>

            {/* TITLE */}
            <div className={styles.inputGroup}>
                <label>Event Title</label>
                <input
                    type="text"
                    placeholder="e.g., Hackathon Global 2026"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />
            </div>

            {/* DATE */}
            <div className={styles.grid3} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div className={styles.inputGroup}>
                    <label>
                        <Calendar size={14} /> Start Date
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            if (date) {
                                const newSub = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                                setSubmissionDeadline(newSub);

                                const newEnd = new Date(newSub.getTime() + 24 * 60 * 60 * 1000);
                                setEndDate(newEnd);
                            }
                        }}
                        minDate={minStart}
                        filterTime={filterStartTime} // Chặn giờ cụ thể
                        showTimeSelect
                        dateFormat="dd/MM/yyyy h:mm aa"
                        placeholderText="After 24h from now"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ color: '#e67e22' }}><Calendar size={14} /> Submission Deadline</label>
                    <DatePicker
                        selected={submissionDeadline}
                        onChange={(date) => {
                            setSubmissionDeadline(date);
                            // Tự động gợi ý EndDate = Deadline + 24h
                            const suggestedEnd = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                            setEndDate(suggestedEnd);
                        }}
                        minDate={minSubmission}
                        disabled={!startDate}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy h:mm aa"
                        placeholderText="Before the event ends 24h"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>
                        <Calendar size={14} /> End Date
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        minDate={minEndLimit}
                        filterTime={filterEndTime}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy h:mm aa"
                        placeholderText="After the event starts 24h"
                        disabled={!submissionDeadline}
                    />
                </div>
            </div>

            {/* BANNER */}
            <div className={styles.inputGroup}>
                <label>
                    <ImageIcon size={14} /> Event Banner
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
                            <span>Drag and drop or click to upload image</span>
                        </>
                    )}
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className={styles.inputGroup}>
                <label>Event Description</label>
                <textarea
                    rows={6}
                    placeholder="Share details about the purpose, rules, and guidelines of the event..."
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