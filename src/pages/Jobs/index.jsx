import React, { useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCw, AlertCircle, CheckCircle2, Clock, Search, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import './QuartzManager.scss';

const QuartzManager = () => {
    const [triggers, setTriggers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 1. Load dữ liệu từ Endpoint mới: /api/admin/quartz/triggers
    const loadData = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch('/api/admin/quartz/triggers');
            if (!response.ok) throw new Error("Lỗi fetch data");
            const data = await response.json();
            setTriggers(data);
        } catch (error) {
            toast.error("Không thể kết nối tới Scheduler");
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // 30s refresh 1 lần
        return () => clearInterval(interval);
    }, [loadData]);

    // 2. Cập nhật lại đường dẫn gọi API theo chuẩn RESTful mới
    const confirmAction = async (action, group, name) => {
        const confirmMsg = {
            run: "Chạy Job này ngay lập tức?",
            pause: "Tạm dừng lịch trình này?",
            resume: "Kích hoạt lại lịch trình này?",
            delete: "Xóa vĩnh viễn lịch trình này?"
        };

        if (!window.confirm(confirmMsg[action])) return;

        try {
            // Mapping URL dựa trên Backend mới: /api/admin/quartz/triggers/{group}/{name}/{action}
            const method = action === 'delete' ? 'DELETE' : 'POST';
            const url = action === 'delete' 
                ? `/api/admin/quartz/triggers/${group}/${name}` 
                : `/api/admin/quartz/triggers/${group}/${name}/${action}`;

            const res = await fetch(url, { method });
            
            if (res.ok) {
                toast.success(`Thực hiện ${action} thành công!`);
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
        t.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper định dạng ngày tháng hiển thị cho mượt
    const formatTime = (timeStr) => {
        if (!timeStr) return "N/A";
        return new Date(timeStr).toLocaleString('vi-VN');
    };

    return (
        <div className="quartz-container">
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
                    placeholder="Tìm theo tên Job, Trigger hoặc Group..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="quartz-card">
                <table className="quartz-table">
                    <thead>
                        <tr>
                            <th>Tên Trigger & Lịch trình</th>
                            <th className="text-center">Trạng thái</th>
                            <th>Thời gian thực thi</th>
                            <th className="text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTriggers.map((t, idx) => (
                            <tr key={`${t.group}-${t.name}`}>
                                <td>
                                    <div className="job-name">{t.name}</div>
                                    <div className="job-subinfo">
                                        <span className="group-label">{t.group}</span>
                                        <span className="type-label">{t.type}</span>
                                    </div>
                                    <div className="job-ref">Job: {t.jobName}</div>
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
                                    <button onClick={() => confirmAction('run', t.group, t.name)} className="btn-icon run" title="Chạy ngay">
                                        <Play size={18} fill="currentColor" />
                                    </button>

                                    {t.state === 'Paused' ? (
                                        <button onClick={() => confirmAction('resume', t.group, t.name)} className="btn-icon resume" title="Kích hoạt lại">
                                            <RotateCw size={18} />
                                        </button>
                                    ) : (
                                        <button onClick={() => confirmAction('pause', t.group, t.name)} className="btn-icon pause" title="Tạm dừng">
                                            <Pause size={18} fill="currentColor" />
                                        </button>
                                    )}

                                    <button onClick={() => confirmAction('delete', t.group, t.name)} className="btn-icon delete" title="Xóa lịch">
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