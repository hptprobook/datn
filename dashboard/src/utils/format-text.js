import { formatCurrency } from "./format-number";

export function renderAddress(data) {
    return `${data?.detailAddress}, ${data?.wardName}, ${data?.districtName}, ${data?.provinceName}`;
}
export function calculateProductDetails(product) {
    // Combine size and color
    const combined = `${product.size} + ${product.color}`;

    // Calculate total price
    const totalPrice = product.quantity * product.price;

    // Return the final result
    return `${combined} x ${product.quantity} x ${product.price} = ${totalPrice.toFixed(2)}`;
}
export function renderNameProduct(product) {
    return `${product.name} x ${product.quantity}`;
}
export function renderTotalPrice(product) {
    const totalPrice = product.totalPrice * product.quantity;
    return `Tổng tiền: ${formatCurrency(totalPrice.toFixed(2))}`;
}
export const slugify = (string) => {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return string.toString().toLowerCase()
        .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
        .replace(/đ/gi, 'd')
        .replace(/\s+/g, '-')
        .replace(p, c => b.charAt(a.indexOf(c)))
        .replace(/&/g, '-and-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}
export const renderStatusStock = (status) => {
    if (status === 'stock') {
        return 'Còn hàng';
    }
    if (status === 'preOrder') {
        return 'Đang đặt hàng';
    }
    return 'Hết hàng'
}
export const renderStatusStockColor = (status) => {
    if (status === 'stock') {
        return 'success';
    }
    if (status === 'preOrder') {
        return 'warning';
    }
    return 'error'
}