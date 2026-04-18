import { useState, useEffect, useCallback, useMemo } from 'react';
import { getMyWallet } from '../../wallet';
import { createEventApi } from '../api/createEvent';
import { getEventApi } from '../api/getEvent';

export const useCreateEvent = () => {
    // --- 1. TRẠNG THÁI HỆ THỐNG & METADATA ---
    const [initialLoading, setInitialLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expertBalance, setExpertBalance] = useState(0);

    // Cấu hình mặc định (Sẽ được cập nhật từ API)
    const [metadata, setMetadata] = useState({
        expertRules: { minRequired: 2, defaultExpertWeight: 70 },
        financialRules: { feePercentage: 5, minFee: 10000, currency: 'VND' },
    });

    // --- 2. STATE CHÍNH CỦA FORM ---
    const [form, setForm] = useState({
        title: '',
        description: '',
        banner: null,
        expertWeight: null,
        isAutoStart: false,
        minExpertsRequired: 2,
        pointPerLike: 1,
        pointPerShare: 3,
    });

    const [criteria, setCriteria] = useState([
        { id: Date.now(), name: 'Creative', description: 'Novel and unique ideas', weightPercentage: 50 },
        { id: Date.now() + 1, name: 'Reality', description: 'Practical applicability', weightPercentage: 50 },
    ]);

    const [prizes, setPrizes] = useState([
        { id: crypto.randomUUID(), label: 'Prize 1', amount: 300000, error: '' },
        { id: crypto.randomUUID(), label: 'Prize 2', amount: 150000, error: '' },
    ]);

    const [invitedExpertIds, setInvitedExpertIds] = useState([]);

    // Logic ngày tháng mặc định
    const defaultDates = useMemo(() => {
        const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const sub = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        const end = new Date(sub.getTime() + 24 * 60 * 60 * 1000);
        return { start, sub, end };
    }, []);

    const [startDate, setStartDate] = useState(defaultDates.start);
    const [submissionDeadline, setSubmissionDeadline] = useState(defaultDates.sub);
    const [endDate, setEndDate] = useState(defaultDates.end);

    // --- 3. COMPUTED PROPERTIES (TÍNH TOÁN) ---

    const totalBudget = useMemo(() => {
        return prizes.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    }, [prizes]);

    // Tính phí nền tảng dựa trên Metadata thực tế từ Server
    const platformFee = useMemo(() => {
        const { feePercentage, minFee } = metadata.financialRules;
        const calculated = totalBudget * (feePercentage / 100);
        // Công thức: Max giữa % ngân sách và phí tối thiểu hệ thống
        return Math.max(calculated, minFee);
    }, [totalBudget, metadata]);

    const totalRequired = useMemo(() => totalBudget + platformFee, [totalBudget, platformFee]);
    const isOverBudget = useMemo(() => totalRequired > expertBalance, [totalRequired, expertBalance]);

    // --- 4. ACTIONS & LOGIC ---

    const fetchAllInitialData = useCallback(async () => {
        setInitialLoading(true);
        try {
            const [walletRes, metaRes] = await Promise.all([getMyWallet(), getEventApi.getCreationMetadata()]);

            const meta = metaRes.data;
            setMetadata(meta);
            setExpertBalance(walletRes?.balance ?? 0);

            // Đồng bộ form với cấu hình server ngay khi tải xong
            setForm((prev) => {
                const hasDraftWeight = prev.expertWeight !== null && prev.expertWeight !== undefined;

                return {
                    ...prev,
                    expertWeight: prev.expertWeight ?? meta.expertRules.defaultExpertWeight ?? 70,
                    minExpertsRequired: prev.minExpertsRequired || meta.expertRules.minRequired || 2,
                };
            });
        } catch (err) {
            console.error('Data initialization error:', err);
            setFetchError('Cannot load system configuration or wallet balance.');
        } finally {
            setInitialLoading(false);
        }
    }, []);

    const toggleExpert = useCallback(
        (id) => {
            setInvitedExpertIds((prev) => {
                const isRemoving = prev.includes(id);
                const newList = isRemoving ? prev.filter((item) => item !== id) : [...prev, id];

                setForm((current) => {
                    const systemMin = metadata.expertRules.minRequired;
                    return {
                        ...current,
                        minExpertsRequired: Math.min(newList.length, Math.max(systemMin, current.minExpertsRequired)),
                    };
                });
                return newList;
            });
        },
        [metadata.expertRules.minRequired],
    );

    const validateStep = useCallback(
        (step) => {
            switch (step) {
                case 1:
                    return !!(form.title && form.description && form.banner);
                case 2:
                    return invitedExpertIds.length >= metadata.expertRules.minRequired - 1;
                case 3:
                    const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weightPercentage || 0), 0);
                    return criteria.length > 0 && criteria.every((c) => c.name.trim() !== '') && totalWeight === 100;
                case 4:
                    return prizes.length > 0 && prizes.every((p) => p.amount > 0);
                default:
                    return true;
            }
        },
        [form, invitedExpertIds, prizes, metadata],
    );

    const handleCreateEvent = async () => {
        if (isOverBudget) throw new Error('Insufficient balance to cover the total event costs!');

        setLoading(true);

        try {
            const formattedCriteria = criteria.map((c) => ({
                name: c.name,
                description: c.description,
                weightPercentage: Number(c.weightPercentage),
            }));

            const payload = {
                ...form,
                startDate,
                submissionDeadline,
                endDate,
                prizes,
                invitedExpertIds,
                criteria: formattedCriteria,
            };

            const response = await createEventApi(payload);
            return response;
        } catch (error) {
            setLoading(false);
            const errorMsg =
                error.response?.data?.message || error.message || 'Error creating event. Please try again.';
            throw new Error(errorMsg);
        }
    };

    // --- 5. EFFECTS ---
    useEffect(() => {
        fetchAllInitialData();
    }, [fetchAllInitialData]);

    return {
        // Form & Data
        form,
        setForm,
        criteria,
        setCriteria,
        prizes,
        setPrizes,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        submissionDeadline,
        setSubmissionDeadline,
        invitedExpertIds,
        setInvitedExpertIds,

        // Tài chính (Đã format/tính toán)
        expertBalance,
        totalBudget,
        feePercentage: metadata.financialRules.feePercentage,
        platformFee,
        totalRequired,
        isOverBudget,
        currency: metadata.financialRules.currency,

        // Trạng thái UI
        loading,
        initialLoading,
        fetchError,
        metadata,

        // Actions
        toggleExpert,
        validateStep,
        createEvent: handleCreateEvent,
        refreshBalance: fetchAllInitialData,
    };
};
