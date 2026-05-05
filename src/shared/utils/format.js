export const formatMoney = (amount, options = {}) => {
    // 1. Ép kiểu về số, mặc định là 0 nếu input lỗi
    const value = Number(amount) || 0;

    // 2. Các tùy chỉnh mặc định
    const {
        locale = 'vi-VN',
        currency = 'VND',
        minimumFractionDigits = 0,
        maximumFractionDigits = 2,
        useSymbol = false, // TRUE: hiện ₫ | FALSE: hiện chữ VND
        showUnit = true    // Có hiển thị đơn vị phía sau không
    } = options;

    try {
        if (useSymbol) {
            // Định dạng chuẩn quốc tế: 1.000.000 ₫
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits,
                maximumFractionDigits,
            }).format(value);
        } else {
            // Định dạng số: 1.000.000
            const formattedNumber = new Intl.NumberFormat(locale, {
                minimumFractionDigits,
                maximumFractionDigits,
            }).format(value);

            // Kết hợp với chữ VND: 1.000.000 VND
            return showUnit ? `${formattedNumber} ${currency}` : formattedNumber;
        }
    } catch (error) {
        console.error('Error formatting money:', error);
        return '0';
    }
};