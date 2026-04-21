import React, { useEffect, useMemo, useState } from 'react';
import styles from './Report.module.scss';
import {
  FaMagnifyingGlass,
  FaEye,
  FaTriangleExclamation,
  FaCircleCheck,
  FaCircleXmark,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaInfo,
} from 'react-icons/fa6';
import {
  getAdminReportDetail,
  getAdminReports,
  reviewAdminReport,
} from '../../features/reports/api/reportApi';

function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    hasMore: false,
  });

  const [selectedReportId, setSelectedReportId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    newStatus: 'Resolved',
    adminNote: '',
    hidePostWhenResolved: true,
    postStatusToApply: 'Rejected',
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [toast, setToast] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchReports(1, statusFilter);
  }, [statusFilter]);

  const showToast = (type, title, message = '') => {
    setToast({
      open: true,
      type,
      title,
      message,
    });

    window.clearTimeout(window.__reportToastTimer);
    window.__reportToastTimer = window.setTimeout(() => {
      setToast({
        open: false,
        type: 'success',
        title: '',
        message: '',
      });
    }, 2600);
  };

  const closeToast = () => {
    window.clearTimeout(window.__reportToastTimer);
    setToast({
      open: false,
      type: 'success',
      title: '',
      message: '',
    });
  };

  const fetchReports = async (
    pageNumber = pagination.page,
    currentStatus = statusFilter,
  ) => {
    try {
      setLoading(true);
      setError('');

      const response = await getAdminReports({
        status: currentStatus === 'All' ? null : currentStatus,
        pageNumber,
        pageSize: pagination.pageSize,
      });

      const data = response?.data ?? {};

      setReports(Array.isArray(data.items) ? data.items : []);
      setPagination({
        page: data.page ?? pageNumber,
        pageSize: data.pageSize ?? 10,
        totalCount: data.totalCount ?? 0,
        hasMore: data.hasMore ?? false,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Không thể tải danh sách báo cáo.',
      );
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (userReportId) => {
    try {
      setSelectedReportId(userReportId);
      setDetail(null);
      setDetailLoading(true);
      setError('');

      const response = await getAdminReportDetail(userReportId);
      const data = response?.data ?? null;
      setDetail(data);

      setReviewForm({
        newStatus: 'Resolved',
        adminNote: data?.adminNote || '',
        hidePostWhenResolved: true,
        postStatusToApply: 'Rejected',
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Không thể tải chi tiết báo cáo.',
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedReportId(null);
    setDetail(null);
    setDetailLoading(false);
    setActionLoading(false);
    setPreviewOpen(false);
    setPreviewIndex(0);
  };

  const handleSubmitReview = async () => {
    if (!selectedReportId || actionLoading) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn ${
        reviewForm.newStatus === 'Resolved' ? 'xử lý' : 'bác bỏ'
      } báo cáo #${selectedReportId} không?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError('');

      await reviewAdminReport(selectedReportId, {
        newStatus: reviewForm.newStatus,
        adminNote: reviewForm.adminNote?.trim() || null,
        hidePostWhenResolved:
          reviewForm.newStatus === 'Resolved'
            ? reviewForm.hidePostWhenResolved
            : false,
        postStatusToApply:
          reviewForm.newStatus === 'Resolved'
            ? reviewForm.postStatusToApply || null
            : null,
      });

      await fetchReports(pagination.page, statusFilter);
      closeDetail();

      showToast(
        'success',
        'Xử lý hoàn tất',
        reviewForm.newStatus === 'Resolved'
          ? 'Báo cáo đã được xử lý thành công.'
          : 'Báo cáo đã được bác bỏ thành công.',
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể xử lý báo cáo.';

      setError(message);
      showToast('error', 'Xử lý thất bại', message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickResolve = async (userReportId) => {
    if (!userReportId || actionLoading) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xử lý hợp lệ báo cáo #${userReportId} không?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError('');

      await reviewAdminReport(userReportId, {
        newStatus: 'Resolved',
        adminNote: 'Đã xử lý bởi admin.',
        hidePostWhenResolved: true,
        postStatusToApply: 'Rejected',
      });

      await fetchReports(pagination.page, statusFilter);

      if (selectedReportId === userReportId) {
        closeDetail();
      }

      showToast(
        'success',
        'Đã xử lý',
        `Báo cáo #${userReportId} đã được xử lý thành công.`,
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể xử lý báo cáo.';

      setError(message);
      showToast('error', 'Xử lý thất bại', message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickReject = async (userReportId) => {
    if (!userReportId || actionLoading) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn bác báo cáo #${userReportId} không?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError('');

      await reviewAdminReport(userReportId, {
        newStatus: 'Rejected',
        adminNote: 'Không đủ căn cứ vi phạm.',
        hidePostWhenResolved: false,
        postStatusToApply: null,
      });

      await fetchReports(pagination.page, statusFilter);

      if (selectedReportId === userReportId) {
        closeDetail();
      }

      showToast(
        'success',
        'Đã bác báo cáo',
        `Báo cáo #${userReportId} đã được bác bỏ.`,
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể bác báo cáo.';

      setError(message);
      showToast('error', 'Bác báo cáo thất bại', message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return reports;

    return reports.filter((item) => {
      const content = [
        item.userReportId,
        item.postId,
        item.reportedByUserName,
        item.postOwnerUserName,
        item.reportTypeName,
        item.reason,
        item.status,
        item.postStatus,
        item.postVisibility,
      ]
        .map((x) => (x ?? '').toString().toLowerCase())
        .join(' ');

      return content.includes(keyword);
    });
  }, [reports, searchTerm]);

  const pendingCount = useMemo(
    () => reports.filter((x) => x.status === 'Pending').length,
    [reports],
  );

  const imageUrls = useMemo(() => {
    if (!detail?.imageUrls || !Array.isArray(detail.imageUrls)) return [];
    return detail.imageUrls.filter(Boolean);
  }, [detail]);

  const openPreview = (index) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  const showPrevImage = (e) => {
    e?.stopPropagation?.();
    if (!imageUrls.length) return;
    setPreviewIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const showNextImage = (e) => {
    e?.stopPropagation?.();
    if (!imageUrls.length) return;
    setPreviewIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return styles.pending;
      case 'Reviewing':
        return styles.reviewing;
      case 'Resolved':
        return styles.resolved;
      case 'Rejected':
        return styles.rejected;
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xử lý';
      case 'Reviewing':
        return 'Đang xem';
      case 'Resolved':
        return 'Đã xử lý';
      case 'Rejected':
        return 'Đã bác bỏ';
      default:
        return status || '--';
    }
  };

  const formatDate = (value) => {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2>Article reporting management</h2>
          <p>Review, examine details, and process user reports.</p>
        </div>

        <div className={styles.reportCount}>
          <FaTriangleExclamation />
          <span>
            There are <b>{pendingCount}</b> reports pending processing
          </span>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <FaMagnifyingGlass />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tabs}>
          <button
            className={statusFilter === 'Pending' ? styles.tabActive : ''}
            onClick={() => setStatusFilter('Pending')}
          >
            Awaiting processing
          </button>
          <button
            className={statusFilter === 'Resolved' ? styles.tabActive : ''}
            onClick={() => setStatusFilter('Resolved')}
          >
            Processed
          </button>
          <button
            className={statusFilter === 'Rejected' ? styles.tabActive : ''}
            onClick={() => setStatusFilter('Rejected')}
          >
            Rejected
          </button>
          <button
            className={statusFilter === 'All' ? styles.tabActive : ''}
            onClick={() => setStatusFilter('All')}
          >
            All
          </button>
        </div>
      </div>

      {error ? (
        <div className={styles.errorBox}>
          <span>{error}</span>
          <button onClick={() => fetchReports(pagination.page, statusFilter)}>
            Retry
          </button>
        </div>
      ) : null}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reported By</th>
              <th>Post Owner</th>
              <th>Post</th>
              <th>Report Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className={styles.emptyCell}>
                  Loading data...
                </td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.emptyCell}>
                  No reports available.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.userReportId}>
                  <td className={styles.reportId}>#{report.userReportId}</td>

                  <td>
                    <div className={styles.mainText}>
                      {report.reportedByUserName || '--'}
                    </div>
                    <div className={styles.subText}>
                      ID: {report.reportedByAccountId ?? '--'}
                    </div>
                  </td>

                  <td>
                    <div className={styles.mainText}>
                      {report.postOwnerUserName || '--'}
                    </div>
                    <div className={styles.subText}>
                      ID: {report.postOwnerAccountId ?? '--'}
                    </div>
                  </td>

                  <td className={styles.targetCol}>
                    <div className={styles.targetName}>Post #{report.postId}</div>
                    <div className={styles.reportDate}>
                      {formatDate(report.createdAt)}
                    </div>
                  </td>

                  <td>{report.reportTypeName || '--'}</td>

                  <td className={styles.reasonCol}>
                    {report.reason?.trim() || '--'}
                  </td>

                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        report.status,
                      )}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.btnView}
                        title="See details"
                        onClick={() => openDetail(report.userReportId)}
                        disabled={actionLoading}
                      >
                        <FaEye />
                      </button>

                      <button
                        className={styles.btnDone}
                        title="Valid processing"
                        onClick={() => handleQuickResolve(report.userReportId)}
                        disabled={actionLoading}
                      >
                        <FaCircleCheck />
                      </button>

                      <button
                        className={styles.btnReject}
                        title="Reject report"
                        onClick={() => handleQuickReject(report.userReportId)}
                        disabled={actionLoading}
                      >
                        <FaCircleXmark />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          disabled={pagination.page <= 1 || loading}
          onClick={() => fetchReports(pagination.page - 1, statusFilter)}
        >
          Previous Page
        </button>

        <span>
          Page <b>{pagination.page}</b>
        </span>

        <button
          disabled={!pagination.hasMore || loading}
          onClick={() => fetchReports(pagination.page + 1, statusFilter)}
        >
          Next page
        </button>
      </div>

      {selectedReportId ? (
        <div className={styles.modalOverlay} onClick={closeDetail}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Report Details #{selectedReportId}</h3>
                <p>View content and process the report.</p>
              </div>

              <button className={styles.iconButton} onClick={closeDetail}>
                <FaXmark />
              </button>
            </div>

            {detailLoading ? (
              <div className={styles.modalLoading}>Loading details...</div>
            ) : !detail ? (
              <div className={styles.modalLoading}>No data available.</div>
            ) : (
              <>
                <div className={styles.detailGrid}>
                  <div className={styles.detailCard}>
                    <h4>Report Information</h4>
                    <p>
                      <b>Reported By:</b> {detail.reportedByUserName} (ID:{' '}
                      {detail.reportedByAccountId})
                    </p>
                    <p>
                      <b>Post Owner:</b> {detail.postOwnerUserName} (ID:{' '}
                      {detail.postOwnerAccountId})
                    </p>
                    <p>
                      <b>Report Type:</b> {detail.reportTypeName}
                    </p>
                    <p>
                      <b>Report Type Description:</b> {detail.reportTypeDescription || '--'}
                    </p>
                    <p>
                      <b>User Reason:</b> {detail.reason || '--'}
                    </p>
                    <p>
                      <b>Created Date:</b> {formatDate(detail.createdAt)}
                    </p>
                    <p>
                      <b>Report Status:</b>{' '}
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          detail.status,
                        )}`}
                      >
                        {getStatusLabel(detail.status)}
                      </span>
                    </p>
                    <p>
                      <b>ReviewedAt:</b> {formatDate(detail.reviewedAt)}
                    </p>
                    <p>
                      <b>ReviewedBy:</b> {detail.reviewedBy ?? '--'}
                    </p>
                    <p>
                      <b>AdminNote:</b> {detail.adminNote || '--'}
                    </p>
                  </div>

                  <div className={styles.detailCard}>
                    <h4>Post Information</h4>
                    <p>
                      <b>Post ID:</b> {detail.postId}
                    </p>
                    <p>
                      <b>Title:</b> {detail.postTitle || '--'}
                    </p>
                    <p>
                      <b>Content:</b>
                    </p>
                    <div className={styles.postPreview}>
                      {detail.postContent || '--'}
                    </div>

                    <div className={styles.mediaSection}>
                      <div className={styles.mediaHeader}>
                        <span className={styles.mediaTitle}>Image for the article</span>
                        <span className={styles.mediaCount}>
                          {imageUrls.length} images
                        </span>
                      </div>

                      {imageUrls.length > 0 ? (
                        <>
                          <div className={styles.imageStackRow}>
                            {imageUrls.slice(0, 4).map((url, index) => (
                              <button
                                key={`${url}-${index}`}
                                type="button"
                                className={styles.stackCard}
                                onClick={() => openPreview(index)}
                                title={`View image ${index + 1}`}
                              >
                                <img src={url} alt={`post-${index}`} />
                                {index === 3 && imageUrls.length > 4 ? (
                                  <span className={styles.moreBadge}>
                                    +{imageUrls.length - 4}
                                  </span>
                                ) : null}
                              </button>
                            ))}
                          </div>

                          <div className={styles.imageGridCompact}>
                            {imageUrls.map((url, index) => (
                              <button
                                key={`${url}-thumb-${index}`}
                                type="button"
                                className={styles.imageThumb}
                                onClick={() => openPreview(index)}
                                title={`View image ${index + 1}`}
                              >
                                <img src={url} alt={`post-thumb-${index}`} />
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className={styles.noImage}>No images available</p>
                      )}
                    </div>

                    <p>
                      <b>Post status:</b> {detail.postStatus || '--'}
                    </p>
                    <p>
                      <b>Visibility:</b> {detail.postVisibility || '--'}
                    </p>
                  </div>
                </div>

                <div className={styles.reviewBox}>
                  <h4>Handle Report</h4>

                  <div className={styles.formRow}>
                    <label>New Status</label>
                    <select
                      value={reviewForm.newStatus}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          newStatus: e.target.value,
                        }))
                      }
                      disabled={actionLoading}
                    >
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className={styles.formRow}>
                    <label>Admin Note</label>
                    <textarea
                      rows="4"
                      value={reviewForm.adminNote}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          adminNote: e.target.value,
                        }))
                      }
                      placeholder="Enter admin note..."
                      disabled={actionLoading}
                    />
                  </div>

                  {reviewForm.newStatus === 'Resolved' ? (
                    <>
                      <div className={styles.checkboxRow}>
                        <input
                          id="hidePostWhenResolved"
                          type="checkbox"
                          checked={reviewForm.hidePostWhenResolved}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              hidePostWhenResolved: e.target.checked,
                            }))
                          }
                          disabled={actionLoading}
                        />
                        <label htmlFor="hidePostWhenResolved">
                          Hide posts when processed correctly.
                        </label>
                      </div>

                      <div className={styles.formRow}>
                        <label>Post Status to Apply</label>
                        <select
                          value={reviewForm.postStatusToApply}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              postStatusToApply: e.target.value,
                            }))
                          }
                          disabled={actionLoading}
                        >
                          <option value="Rejected">Rejected</option>
                          <option value="Banned">Banned</option>
                          <option value="">No change</option>
                        </select>
                      </div>
                    </>
                  ) : null}

                  <div className={styles.modalActions}>
                    <button
                      className={styles.btnPrimary}
                      onClick={handleSubmitReview}
                      disabled={actionLoading}
                    >
                      <FaCircleCheck />
                      {actionLoading ? 'Saving...' : 'Save Handling'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {previewOpen && imageUrls.length > 0 ? (
        <div className={styles.previewOverlay} onClick={closePreview}>
          <div
            className={styles.previewModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={`${styles.previewControl} ${styles.previewClose}`}
              onClick={closePreview}
            >
              <FaXmark />
            </button>

            {imageUrls.length > 1 ? (
              <button
                type="button"
                className={`${styles.previewControl} ${styles.previewPrev}`}
                onClick={showPrevImage}
              >
                <FaChevronLeft />
              </button>
            ) : null}

            <img
              src={imageUrls[previewIndex]}
              alt={`preview-${previewIndex}`}
              className={styles.previewImage}
            />

            {imageUrls.length > 1 ? (
              <button
                type="button"
                className={`${styles.previewControl} ${styles.previewNext}`}
                onClick={showNextImage}
              >
                <FaChevronRight />
              </button>
            ) : null}

            <div className={styles.previewFooter}>
              <span>
                Ảnh {previewIndex + 1} / {imageUrls.length}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {toast.open ? (
        <div
          className={`${styles.toast} ${
            toast.type === 'success' ? styles.toastSuccess : styles.toastError
          }`}
        >
          <div className={styles.toastIcon}>
            {toast.type === 'success' ? <FaCheck /> : <FaInfo />}
          </div>

          <div className={styles.toastContent}>
            <div className={styles.toastTitle}>{toast.title}</div>
            {toast.message ? (
              <div className={styles.toastMessage}>{toast.message}</div>
            ) : null}
          </div>

          <button
            type="button"
            className={styles.toastClose}
            onClick={closeToast}
            aria-label="Close notifications"
          >
            <FaXmark />
          </button>

          <div className={styles.toastProgress} />
        </div>
      ) : null}
    </div>
  );
}

export default ReportManagement;