import { useState, useEffect, useCallback, useMemo } from 'react';
import { getMyWallet } from '../../wallet';
import { createEventApi } from '../api/createEvent';
import { getEventApi } from '../api/getEvent';

// Hằng số cấu hình hệ thống
const FEE_PERCENT = 0.05;

export const useCreateEvent = () => {
    // 1. Trạng thái UI
    const [initialLoading, setInitialLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [loading, setLoading] = useState(false);

    // 2. State chính của Form
    const [form, setForm] = useState({
        title: '',
        description: '',
        banner: null,
        expertWeight: 70,
        isAutoStart: false,
        minExpertsRequired: 2,
        pointPerLike: 1,
        pointPerShare: 3,
    });

    const [prizes, setPrizes] = useState([
        { label: 'Giải Nhất', amount: 300000 },
        { label: 'Giải Nhì', amount: 150000 },
    ]);

    // const [hashtags, setHashtags] = useState(['#StyleChallenge']);
    const defaultStartDate = useMemo(() => new Date(Date.now() + 24 * 60 * 60 * 1000), []);
    const defaultSubmission = useMemo(
        () => new Date(defaultStartDate.getTime() + 24 * 60 * 60 * 1000),
        [defaultStartDate],
    );
    const defaultEndDate = useMemo(
        () => new Date(defaultSubmission.getTime() + 24 * 60 * 60 * 1000),
        [defaultSubmission],
    );
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [submissionDeadline, setSubmissionDeadline] = useState(defaultSubmission);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [invitedExpertIds, setInvitedExpertIds] = useState([]);
    const [expertBalance, setExpertBalance] = useState(0);
    const [feeConfig, setFeeConfig] = useState({ feePercentage: 0, minFee: 0 });

    // 3. Computed Properties (Tính toán giá trị phụ thuộc)
    const totalBudget = useMemo(() => {
        return prizes.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    }, [prizes]);

    const fetchFeeConfig = useCallback(async () => {
        try {
            const res = await getEventApi.getEventFees();
            const data = res.data;
            setFeeConfig({
                percentage: (data.feePercentage || 5) / 100,
                minFee: data.minFee || 0,
            });
        } catch (err) {
            console.error('Lỗi lấy cấu hình phí:', err);
        }
    }, []);

    // 2. Tính toán lại platformFee dựa trên feeConfig
    const platformFee = useMemo(() => {
        const calculated = totalBudget * feeConfig.percentage;
        return Math.max(calculated, feeConfig.minFee);
    }, [totalBudget, feeConfig]);

    const totalRequired = useMemo(() => totalBudget + platformFee, [totalBudget, platformFee]);

    const isOverBudget = useMemo(() => {
        return totalRequired > expertBalance;
    }, [totalRequired, expertBalance]);

    // 4. Logic Validation theo từng bước (Dùng cho UI disabled button Next)
    const validateStep = useCallback(
        (step) => {
            switch (step) {
                case 1:
                    return !!(form.title && form.description && form.banner);
                case 2:
                    return invitedExpertIds.length >= 2;
                case 3:
                    return prizes.length > 0 && prizes.every((p) => p.amount > 0);
                default:
                    return true;
            }
        },
        [form, invitedExpertIds, prizes],
    );

    // 5. Actions
    const fetchBalance = useCallback(async () => {
        try {
            const data = await getMyWallet();
            setExpertBalance(data?.balance ?? 0);
            setFetchError(null);
        } catch (err) {
            setFetchError('Không thể kết nối với hệ thống ví.');
        } finally {
            setInitialLoading(false);
        }
    }, []);

    const toggleExpert = useCallback((id) => {
        setInvitedExpertIds((prev) => {
            const isRemoving = prev.includes(id);
            const newList = isRemoving ? prev.filter((item) => item !== id) : [...prev, id];

            setForm((current) => {
                const selectedCount = newList.length;

                return {
                    ...current,
                    // Nếu chọn 0-2 người thì ép về 2.
                    // Nếu chọn > 2 người thì có thể để bằng số lượng đã chọn hoặc giữ nguyên tùy bạn.
                    minExpertsRequired: newList.length >= 2 ? newList.length : 2,
                    // Hoặc: Math.max(2, selectedCount) nếu bạn muốn
                    // tối thiểu phải là toàn bộ số người đã mời.
                };
            });

            return newList;
        });
    }, []);

    const handleCreateEvent = async () => {
        if (isOverBudget) throw new Error('Số dư không đủ!');

        setLoading(true);
        try {
            const payload = {
                title: form.title,
                description: form.description,
                imageFile: form.banner,
                expertWeight: form.expertWeight,
                userWeight: 100 - form.expertWeight,
                startDate: startDate.toISOString(),
                submissionDeadline: submissionDeadline.toISOString(),
                endDate: endDate.toISOString(),
                prizes: prizes,
                invitedExpertIds: invitedExpertIds,
                pointPerLike: form.pointPerLike,
                pointPerShare: form.pointPerShare,
                minExpertsRequired: Math.max(2, form.minExpertsRequired || 2),
                isAutoStart: form.isAutoStart,
            };

            console.group('🚀 [Step 1] Hook Payload');
            console.log('Dữ liệu chuẩn bị gửi đi:', payload);
            console.groupEnd();

            const response = await createEventApi(payload);
            return response;
        } catch (error) {
            console.group('❌ [Error] Create Event Failed');
            console.error('Status:', error.response?.status);
            console.error('Data từ Server:', error.response?.data);
            console.groupEnd();
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi khi tạo sự kiện.';
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
        fetchFeeConfig();
    }, [fetchBalance, fetchFeeConfig]);

    return {
        // States & Form Data
        form,
        setForm,
        prizes,
        setPrizes,
        // hashtags,
        // setHashtags,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        submissionDeadline,
        setSubmissionDeadline,
        invitedExpertIds,

        // Tài chính
        expertBalance,
        totalBudget,
        feePercentage: feeConfig.percentage * 100,
        platformFee,
        totalRequired,
        isOverBudget,

        // Trạng thái hệ thống
        loading,
        initialLoading,
        fetchError,

        // Actions
        toggleExpert,
        validateStep,
        createEvent: handleCreateEvent,
        fetchBalance,
    };
};
