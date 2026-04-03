import React, { useEffect, useRef, useCallback } from 'react';
import { useSystemSettings } from '@/features/system';
import { FaSpinner, FaCheck, FaInfoCircle } from 'react-icons/fa';
import styles from './Settings.module.scss';

const SystemSettingsPage = () => {
  const { settings, loading, updatingKey, fetchAll, handleUpdate } = useSystemSettings();
  const isProcessingRef = useRef(null);

  useEffect(() => {
    fetchAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onTriggerUpdate = useCallback(async (setting, newVal) => {
    const val = newVal.trim();

    // Không làm gì nếu giá trị không đổi hoặc đang trong quá trình xử lý key này
    if (
      val === String(setting.settingValue) || 
      isProcessingRef.current === setting.settingKey ||
      updatingKey === setting.settingKey
    ) {
      return;
    }

    isProcessingRef.current = setting.settingKey;

    try {
      await handleUpdate(setting.settingKey, val);
    } finally {
      isProcessingRef.current = null;
    }
  }, [handleUpdate, updatingKey]);

  if (loading && settings.length === 0) {
    return (
      <div className={styles.pageLoading}>
        <FaSpinner className={styles.spin} /> Đang tải cấu hình...
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      <header className={styles.header}>
        <div className={styles.titleInfo}>
          <h1>Cấu hình hệ thống</h1>
          <p>Quản lý các tham số tài chính và vận hành nền tảng.</p>
        </div>
        <button 
          onClick={fetchAll} 
          className={styles.refreshBtn} 
          title="Làm mới"
          disabled={loading}
        >
          {loading ? <FaSpinner className={styles.spin} /> : 'Làm mới dữ liệu'}
        </button>
      </header>

      <div className={styles.card}>
        <table className={styles.settingsTable}>
          <thead>
            <tr>
              <th>Tham số</th>
              <th style={{ width: '300px' }}>Giá trị cấu hình</th>
              <th>Loại</th>
              <th>Mô tả & Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => {
              const isUpdating = updatingKey === s.settingKey;
              
              return (
                <tr key={s.settingKey} className={isUpdating ? styles.rowSaving : ''}>
                  <td className={styles.keyCell}>
                    <strong>{s.settingKey}</strong>
                    {isUpdating && <span className={styles.savingTag}>Đang lưu...</span>}
                  </td>

                  <td className={styles.inputCell}>
                    <div className={styles.inputGroup}>
                      <input
                        // key cực kỳ quan trọng để reset input khi server update hoặc fetchAll chạy lại
                        key={`${s.settingKey}-${s.settingValue}`}
                        defaultValue={s.settingValue}
                        disabled={isUpdating}
                        onBlur={(e) => onTriggerUpdate(s, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onTriggerUpdate(s, e.target.value);
                            e.currentTarget.blur();
                          }
                          if (e.key === 'Escape') {
                            e.currentTarget.value = s.settingValue; // Trả về giá trị cũ
                            e.currentTarget.blur();
                          }
                        }}
                      />
                      <div className={styles.statusIcon}>
                        {isUpdating ? (
                          <FaSpinner className={styles.spin} />
                        ) : (
                          <FaCheck className={styles.checkIcon} title="Đã lưu" />
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`${styles.typeTag} ${styles[s.dataType?.toLowerCase()]}`}>
                      {s.dataType || 'String'}
                    </span>
                  </td>

                  <td className={styles.descriptionCell}>
                    <div className={styles.descWrapper}>
                      <FaInfoCircle className={styles.infoIcon} />
                      <span>{s.description}</span>
                    </div>
                    {s.updatedAt && (
                      <small className={styles.updatedAt}>
                        Cập nhật: {new Date(s.updatedAt).toLocaleString('vi-VN')}
                      </small>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemSettingsPage;