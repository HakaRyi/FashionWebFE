import { useState, useEffect, useCallback } from 'react';
import { getMyWallet } from '../../wallet';
import { createEvent } from '../api/createEvent';

export const useCreateEvent = () => {
    // 1. Quản lý trạng thái khởi tạo
    const [initialLoading, setInitialLoading] = useState(true); // Trạng thái load ví lần đầu
    const [fetchError, setFetchError] = useState(null); // Lỗi khi gọi API ví

    const [form, setForm] = useState({
        title: '',
        description: '',
        imageFile: null,
        imagePreview: null,
        expertWeight: 70,
    });

    const [prizes, setPrizes] = useState([
        { label: 'Giải Nhất', amount: 300 },
        { label: 'Giải Nhì', amount: 150 },
    ]);

    const [hashtags, setHashtags] = useState(['#StyleChallenge']);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    const [expertBalance, setExpertBalance] = useState(0);
    const [loading, setLoading] = useState(false); // Trạng thái khi bấm tạo event

    // 2. Hàm load balance có xử lý lỗi chi tiết
    const loadBalance = useCallback(async () => {
        setInitialLoading(true);
        setFetchError(null);
        try {
            const data = await getMyWallet();
            // Đảm bảo data tồn tại và có balance
            setExpertBalance(data?.balance ?? 0);
        } catch (err) {
            console.error('Wallet API Error:', err);
            setFetchError('Không thể kết nối với hệ thống ví. Vui lòng thử lại.');
        } finally {
            setInitialLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBalance();
    }, [loadBalance]);

    // 3. Hàm tạo Event
    const createEvent = async () => {
        if (totalBudget > expertBalance) {
            alert('Số dư không đủ để tổ chức sự kiện!');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                prizes,
                hashtags,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };

            await createEvent(payload);
            alert('Khai mạc sự kiện thành công!');
            // Có thể redirect hoặc reset form ở đây
        } catch (error) {
            console.error('Create Event Error:', error);
            alert(error.response?.data?.message || 'Lỗi khi tạo sự kiện. Vui lòng kiểm tra lại.');
        } finally {
            setLoading(false);
        }
    };

    // 4. Tính toán logic
    const totalBudget = prizes.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const isOverBudget = totalBudget > expertBalance;

    return {
        // Form states
        form,
        setForm,
        prizes,
        setPrizes,
        hashtags,
        setHashtags,
        startDate,
        setStartDate,
        endDate,
        setEndDate,

        // Status states
        expertBalance,
        totalBudget,
        isOverBudget,
        loading, // Cho nút Submit
        initialLoading, // Cho trang loading ban đầu
        fetchError, // Để hiển thị lỗi kết nối API

        // Actions
        createEvent,
        reloadBalance: loadBalance,
    };
};
