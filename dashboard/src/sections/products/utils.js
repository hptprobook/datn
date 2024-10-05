export const formatNumber = (number) => {
    if (!number) return '';
    const numericValue = number.replace(/\D/g, '');
    return new Intl.NumberFormat('vi-VN').format(numericValue);
};
export const returnNumber = (number) => {
    if (!number) return ''; // Return empty if no input
    const numericValue = number.replace(/\D/g, ''); // Remove non-digit characters
    return parseInt(numericValue, 10); // Convert to integer
};