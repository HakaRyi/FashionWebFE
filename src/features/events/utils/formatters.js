export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
};

export const formatCurrency = (amount) => {
    return amount?.toLocaleString('vi-VN') + ' đ';
};