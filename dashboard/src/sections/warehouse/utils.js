import * as Yup from 'yup';

export const schema = Yup.object().shape({
  latitude: Yup.number()
    .required('Vĩ độ là bắt buộc')
    .typeError('Vĩ độ phải là số'),
  longitude: Yup.number()
    .required('Kinh độ là bắt buộc')
    .typeError('Kinh độ phải là số'),
  name: Yup.string()
    .trim()
    .min(1, 'Tên không được để trống')
    .required('Tên là bắt buộc'),
    address: Yup.string()
    .trim()
    .min(1, 'Địa chỉ không được để trống')
    .required('Địa chỉ là bắt buộc'),
  capacity: Yup.number()
    .integer('Sức chứa phải là số nguyên')
    .required('Sức chứa là bắt buộc'),
  currentQuantity: Yup.number()
    .integer('Số lượng tồn kho phải là số nguyên')
    .default(0),
});
export const validateCoordinates = (input) => {
  const coordinatesRegex = /^([-+]?\d{1,2}(\.\d+)?),\s*([-+]?\d{1,3}(\.\d+)?)$/;

  if (coordinatesRegex.test(input)) {
    const [latitude, longitude] = input.split(",").map(Number);

    // Kiểm tra vĩ độ và kinh độ nằm trong phạm vi hợp lệ
    if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
      return true;
    }
  }
  return false;
}