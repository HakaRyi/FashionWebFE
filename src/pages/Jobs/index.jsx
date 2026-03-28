import React, { useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCw, AlertCircle, CheckCircle2, Clock, Search, Trash2, Info, X } from 'lucide-react';
import { toast } from 'react-toastify';
import './QuartzManager.scss';

const QuartzManager = () => {
    const [triggers, setTriggers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // State cho Modal xác nhận
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        action: null,
        group: '',
        name: '',
        message: ''
    });

    const loadData = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const [jobsRes, triggersRes] = await Promise.all([
                fetch('/api/admin/quartz/jobs'),
                fetch('/api/admin/quartz/triggers')
            ]);

            if (!jobsRes.ok || !triggersRes.ok) throw new Error("Lỗi fetch data từ server");

            const jobsData = await jobsRes.json();
            const triggersData = await triggersRes.json();

            const mergedData = triggersData.map(trigger => {
                const relatedJob = jobsData.find(j => j.name === trigger.jobName && j.group === trigger.jobGroup);
                return {
                    ...trigger,
                    description: relatedJob ? relatedJob.description : "Không có mô tả"
                };
            });

            setTriggers(mergedData);
        } catch (error) {
            toast.error("Không thể kết nối tới Scheduler");
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, [loadData]);

    // Mở Modal thay vì gọi window.confirm
    const handleActionClick = (action, group, name) => {
        const messages = {
            run: "Bạn có chắc chắn muốn chạy Job này ngay lập tức không?",
            pause: "Hệ thống sẽ tạm dừng lịch trình này cho đến khi được kích hoạt lại.",
            resume: "Kích hoạt lại lịch trình để tiếp tục thực thi theo thời gian đã định.",
            delete: "Hành động này không thể hoàn tác. Xóa vĩnh viễn lịch trình này?"
        };

        setConfirmModal({
            isOpen: true,
            action,
            group,
            name,
            message: messages[action]
        });
    };

    const executeAction = async () => {
        const { action, group, name } = confirmModal;
        setConfirmModal(prev => ({ ...prev, isOpen: false })); // Đóng modal ngay

        try {
            const method = action === 'delete' ? 'DELETE' : 'POST';
            const url = action === 'delete'
                ? `/api/admin/quartz/triggers/${group}/${name}`
                : `/api/admin/quartz/triggers/${group}/${name}/${action}`;

            const res = await fetch(url, { method });

            if (res.ok) {
                toast.success(`Thực hiện tác vụ thành công!`);
                loadData();
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || "Thao tác thất bại");
            }
        } catch (err) {
            toast.error("Lỗi hệ thống khi điều khiển Job");
        }
    };

    const filteredTriggers = triggers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (timeStr) => {
        if (!timeStr) return "Chưa có dữ liệu";
        return new Date(timeStr).toLocaleString('vi-VN');
    };

    return (
        <div className="quartz-container">
            {/* Modal Xác Nhận */}
            {confirmModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Xác nhận tác vụ</h3>
                            <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{confirmModal.message}</p>
                            <div className="target-info">
                                <strong>Đối tượng:</strong> {confirmModal.name}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
                                Hủy bỏ
                            </button>
                            <button className={`btn-confirm ${confirmModal.action}`} onClick={executeAction}>
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="quartz-header">
                <div className="header-content">
                    <h1>Hệ thống Tác vụ Ngầm</h1>
                    <p>Quản lý các tiến trình tự động của Fashion Shop</p>
                </div>
                <button
                    onClick={loadData}
                    className={`btn-refresh ${isRefreshing ? 'spinning' : ''}`}
                    disabled={isRefreshing}
                >
                    <RotateCw size={20} />
                </button>
            </div>

            <div className="quartz-search">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Tìm theo tên, mô tả hoặc group..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="quartz-card">
                <table className="quartz-table">
                    <thead>
                        <tr>
                            <th>Thông tin Trigger & Job</th>
                            <th className="text-center">Trạng thái</th>
                            <th>Thời gian thực thi</th>
                            <th className="text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTriggers.map((t) => (
                            <tr key={`${t.group}-${t.name}`}>
                                <td>
                                    <div className="job-name">{t.name}</div>
                                    <div className="job-description">
                                        <Info size={12} style={{ marginRight: '4px' }} />
                                        {t.description}
                                    </div>
                                    <div className="job-subinfo">
                                        <span className="group-label">{t.group}</span>
                                        <span className="type-label">{t.type}</span>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <span className={`status-badge ${t.state.toLowerCase()}`}>
                                        {t.state}
                                    </span>
                                </td>
                                <td>
                                    <div className="time-row">
                                        <Clock size={14} className="icon-blue" />
                                        <span>Tới: <strong>{formatTime(t.nextFireTime)}</strong></span>
                                    </div>
                                    <div className="time-row history">
                                        <CheckCircle2 size={14} />
                                        <span>Vừa xong: {formatTime(t.previousFireTime)}</span>
                                    </div>
                                </td>
                                <td className="text-right actions">
                                    <button onClick={() => handleActionClick('run', t.group, t.name)} className="btn-icon run" title="Chạy ngay">
                                        <Play size={18} fill="currentColor" />
                                    </button>

                                    {t.state === 'Paused' ? (
                                        <button onClick={() => handleActionClick('resume', t.group, t.name)} className="btn-icon resume" title="Kích hoạt lại">
                                            <RotateCw size={18} />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleActionClick('pause', t.group, t.name)} className="btn-icon pause" title="Tạm dừng">
                                            <Pause size={18} fill="currentColor" />
                                        </button>
                                    )}

                                    <button onClick={() => handleActionClick('delete', t.group, t.name)} className="btn-icon delete" title="Xóa lịch">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTriggers.length === 0 && !isRefreshing && (
                    <div className="empty-state">
                        <AlertCircle size={48} />
                        <p>Không tìm thấy Job nào đang hoạt động.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuartzManager;