export const renderSalaryType = (type) => {
    switch (type) {
        case 'hourly':
            return 'Theo giờ';
        case 'daily':
            return 'Theo ngày';
        case 'monthly':
            return 'Theo tháng';
        case 'product':
            return 'Theo sản phẩm';
        case 'contract':
            return 'Hợp đồng';
        case 'customer':
            return 'Theo khách hàng';
        default:
            return '';
    }
};
export const salaryType = [
    'hourly',
    'daily',
    'monthly',
    'product',
    'contract',
    'customer',
];
export const renderRole = (role) => {
    switch (role) {
        case 'root':
            return 'Chủ cửa hàng';
        case 'admin':
            return 'Quản lý';
        case 'staff':
            return 'Nhân viên';
        case 'ban':
            return 'Bị cấm';
        default:
            return '';
    }
}