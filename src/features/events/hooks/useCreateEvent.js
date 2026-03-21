import { useState, useEffect, useCallback, useMemo } from 'react';
import { getMyWallet } from '../../wallet';
import { createEventApi } from '../api/createEvent';

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
        isAutoActivate: false,
        minExpertsRequired: 1,
    });

    const [prizes, setPrizes] = useState([
        { label: 'Giải Nhất', amount: 300000 },
        { label: 'Giải Nhì', amount: 150000 },
    ]);

    // const [hashtags, setHashtags] = useState(['#StyleChallenge']);
    const defaultStartDate = useMemo(() => new Date(Date.now() + 24 * 60 * 60 * 1000), []);
    const defaultEndDate = useMemo(
        () => new Date(defaultStartDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        [defaultStartDate],
    );
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [invitedExpertIds, setInvitedExpertIds] = useState([]);
    const [expertBalance, setExpertBalance] = useState(0);

    // 3. Computed Properties (Tính toán giá trị phụ thuộc)
    const totalBudget = useMemo(() => {
        return prizes.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    }, [prizes]);

    const platformFee = useMemo(() => totalBudget * FEE_PERCENT, [totalBudget]);

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
                    return invitedExpertIds.length > 0;
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

            // Tự động điều chỉnh số lượng expert tối thiểu nếu danh sách mời thay đổi
            setForm((current) => ({
                ...current,
                minExpertsRequired: Math.max(1, Math.min(current.minExpertsRequired, newList.length || 1)),
            }));

            return newList;
        });
    }, []);

    const handleCreateEvent = async () => {
        if (isOverBudget) throw new Error('Số dư không đủ!');

        setLoading(true);
        try {
            // CHỈ GỬI OBJECT SẠCH, không tạo FormData ở đây
            const payload = {
                title: form.title,
                description: form.description,
                imageFile: form.banner, // Chú ý tên field này phải khớp với API bên dưới
                expertWeight: form.expertWeight,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                prizes: prizes,
                invitedExpertIds: invitedExpertIds,
                // Các field khác nếu cần
            };

            const response = await createEventApi(payload);
            return response;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi khi tạo sự kiện.';
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

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
        invitedExpertIds,

        // Tài chính
        expertBalance,
        totalBudget,
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
