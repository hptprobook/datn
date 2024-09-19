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