export const validateEventForm = (form, prizes, startDate, endDate, expertBalance) => {
    const safePrizes = prizes || [];
    const totalBudget = safePrizes.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // 1. Kiểm tra các trường cơ bản
    if (!form.title || form.title.trim().length < 5) {
        return { isValid: false, message: 'Tên sự kiện phải có ít nhất 5 ký tự!' };
    }

    if (!form.banner) {
        return { isValid: false, message: 'Vui lòng tải ảnh bìa cho sự kiện!' };
    }

    // 2. Kiểm tra logic thời gian
    if (startDate >= endDate) {
        return { isValid: false, message: 'Ngày kết thúc phải sau ngày bắt đầu!' };
    }

    if (endDate <= new Date()) {
        return { isValid: false, message: 'Ngày kết thúc không thể ở trong quá khứ!' };
    }

    // 3. Kiểm tra danh sách giải thưởng
    if (safePrizes.length === 0) {
        return { isValid: false, message: 'Sự kiện phải có ít nhất một hạng mục giải thưởng!' };
    }

    const hasEmptyPrize = safePrizes.some((p) => !p.label?.trim() || p.amount <= 0);
    if (hasEmptyPrize) {
        return { isValid: false, message: 'Vui lòng điền đầy đủ tên và giá trị giải thưởng!' };
    }

    // 4. Kiểm tra ngân sách
    if (totalBudget > expertBalance) {
        return { isValid: false, message: 'Số dư khả dụng không đủ để khởi tạo giải thưởng!' };
    }

    return { isValid: true };
};
