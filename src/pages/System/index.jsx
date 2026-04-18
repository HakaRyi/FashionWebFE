import React, { useEffect, useRef, useCallback } from 'react';
import { useSystemSettings } from '@/features/system';
import { FaSpinner, FaCheck, FaInfoCircle } from 'react-icons/fa';
import styles from './Settings.module.scss';

const SystemSettingsPage = () => {
  const { settings, loading, updatingKey, fetchAll, handleUpdate } = useSystemSettings();
  const isProcessingRef = useRef(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const onTriggerUpdate = useCallback(async (setting, newVal) => {
    const val = newVal.trim();

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
        <FaSpinner className={styles.spin} /> Loading configuration...
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      <header className={styles.header}>
        <div className={styles.titleInfo}>
          <h1>System Configuration</h1>
          <p>Manage financial and operational parameters of the platform.</p>
        </div>
        <button
          onClick={fetchAll}
          className={styles.refreshBtn}
          title="Refresh"
          disabled={loading}
        >
          {loading ? <FaSpinner className={styles.spin} /> : 'Refresh Data'}
        </button>
      </header>

      <div className={styles.card}>
        <table className={styles.settingsTable}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th style={{ width: '300px' }}>Configuration Value</th>
              <th>Type</th>
              <th>Description & Notes</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => {
              const isUpdating = updatingKey === s.settingKey;

              return (
                <tr key={s.settingKey} className={isUpdating ? styles.rowSaving : ''}>
                  <td className={styles.keyCell}>
                    <strong>{s.settingKey}</strong>
                    {isUpdating && <span className={styles.savingTag}>Saving...</span>}
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
                            e.currentTarget.value = s.settingValue;
                            e.currentTarget.blur();
                          }
                        }}
                      />
                      <div className={styles.statusIcon}>
                        {isUpdating ? (
                          <FaSpinner className={styles.spin} />
                        ) : (
                          <FaCheck className={styles.checkIcon} title="Saved" />
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
                        Updated: {new Date(s.updatedAt).toLocaleString('vi-VN')}
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