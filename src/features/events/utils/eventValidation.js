export const validateEventForm = (form, prizes, startDate, endDate, expertBalance) => {
    const safePrizes = prizes || [];
    const totalBudget = safePrizes.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // 1. Kiểm tra các trường cơ bản
    if (!form.title || form.title.trim().length < 5) {
        return { isValid: false, message: 'The event name must have at least 5 characters!' };
    }

    if (!form.banner) {
        return { isValid: false, message: 'Please upload a banner image for the event!' };
    }

    // 2. Kiểm tra logic thời gian
    if (startDate >= endDate) {
        return { isValid: false, message: 'The end date must be after the start date!' };
    }

    if (endDate <= new Date()) {
        return { isValid: false, message: 'The end date cannot be in the past!' };
    }

    // 3. Kiểm tra danh sách giải thưởng
    if (safePrizes.length === 0) {
        return { isValid: false, message: 'The event must have at least one prize category!' };
    }

    const hasEmptyPrize = safePrizes.some((p) => !p.label?.trim() || p.amount <= 0);
    if (hasEmptyPrize) {
        return { isValid: false, message: 'Please fill in the name and value for all prize categories!' };
    }

    // 4. Kiểm tra ngân sách
    if (totalBudget > expertBalance) {
        return { isValid: false, message: 'Insufficient available balance to initialize the prizes!' };
    }

    return { isValid: true };
};
