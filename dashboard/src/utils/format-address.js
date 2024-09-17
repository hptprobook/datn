export function renderAddress(data) {
    return `${data?.detailAddress}, ${data?.wardName}, ${data?.districtName}, ${data?.provinceName}`;
}