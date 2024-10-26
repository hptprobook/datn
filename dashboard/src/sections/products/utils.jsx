/* eslint-disable func-names */
import * as Yup from 'yup';
import Iconify from 'src/components/iconify';
import { styled } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

export const formatNumber = (number) => {
  if (!number) return '';
  const numericValue = number.replace(/\D/g, '');
  return new Intl.NumberFormat('vi-VN').format(numericValue);
};

export const returnNumber = (number) => {
  if (!number) return '';
  const numericValue = number.replace(/\D/g, '');
  return parseInt(numericValue, 10);
};

export const variantSchema = Yup.object().shape({
  price: Yup.number()
    .required('Giá không được để trống')
    .min(0, 'Giá không được âm')
    .max(1000000000, 'Giá không được quá 1 tỷ')
    .typeError('Giá phải là số'),

  marketPrice: Yup.number()
    .required('Giá cửa hàng không được để trống')
    .min(0, 'Giá cửa hàng không được âm')
    .max(1000000000, 'Giá cửa hàng không được quá 1 tỷ')
    .typeError('Giá cửa hàng phải là số'),
  warehouseId: Yup.string().required('Nhà kho không được để trống'),
  capitalPrice: Yup.number()
    .required('Giá vốn không được để trống')
    .min(0, 'Giá vốn không được âm')
    .max(1000000000, 'Giá vốn không được quá 1 tỷ')
    .typeError('Giá vốn phải là số')
    .test(
      'capitalPrice-less-than-prices',
      'Giá vốn phải nhỏ hơn hoặc bằng các giá còn lại',
      function (value) {
        const { price, marketPrice, onlinePrice } = this.parent;
        return value <= price && value <= marketPrice && value <= onlinePrice;
      }
    ),

  onlinePrice: Yup.number()
    .required('Giá online không được để trống')
    .min(0, 'Giá online không được âm')
    .max(1000000000, 'Giá online không được quá 1 tỷ')
    .typeError('Giá online phải là số'),

  saleOff: Yup.number()
    .min(0, 'Giá giảm không được âm')
    .max(1000000000, 'Giá giảm không được quá 1 tỷ')
    .typeError('Giá giảm phải là số')
    .test(
      'saleOff-less-than-prices',
      'Giá giảm không được lớn hơn các giá còn lại',
      function (value) {
        const { price, marketPrice, onlinePrice } = this.parent;
        return !value || (value <= price && value <= marketPrice && value <= onlinePrice);
      }
    ),
  stock: Yup.number()
    .required('Số lượng không được để trống')
    .min(0, 'Số lượng không được âm')
    .max(1000000000, 'Số lượng không được quá 1 tỷ')
    .typeError('Số lượng phải là số'),
  sku: Yup.string()
    .required('Mã SKU không được để trống')
    .min(1, 'Mã SKU không được để trống')
    .max(255, 'Mã SKU không được quá 255 ký tự'),
  color: Yup.string()
    .required('Màu sắc không được để trống')
    .min(1, 'Màu sắc không được để trống')
    .max(255, 'Màu sắc không được quá 255 ký tự'),
});

export const sizeSchema = Yup.object().shape({
  size: Yup.string()
    .required('Kích thước không được để trống')
    .min(1, 'Kích thước không được để trống')
    .max(255, 'Kích thước không được quá 255 ký tự'),
  stock: Yup.number()
    .required('Số lượng không được để trống')
    .min(0, 'Số lượng không được âm')
    .max(1000000000, 'Số lượng không được quá 1 tỷ')
    .typeError('Số lượng phải là số'),
  price: Yup.number()
    .required('Giá không được để trống')
    .min(0, 'Giá không được âm')
    .max(1000000000, 'Giá không được quá 1 tỷ')
    .typeError('Giá phải là số'),
  sale: Yup.number()
    .min(1, 'Số lượng có thể bán không được âm')
    .max(1000000000, 'Số lượng có thể bán không được quá 1 tỷ')
    .typeError('Số lượng có thể bán phải là số'),
  trading: Yup.number()
    .min(0, 'Số lượng đang giao dịch không được âm')
    .max(1000000000, 'Số lượng đang giao dịch không được quá 1 tỷ')
    .typeError('Số lượng đang giao dịch phải là số'),
});

export const colorsWithHex = [
  { name: 'Đỏ', hex: '#FF0000' },
  { name: 'Xanh lá cây', hex: '#00FF00' },
  { name: 'Xanh', hex: '#00FF00' },
  { name: 'Xanh dương', hex: '#0000FF' },
  { name: 'Vàng', hex: '#FFFF00' },
  { name: 'Cam', hex: '#FFA500' },
  { name: 'Tím', hex: '#800080' },
  { name: 'Hồng', hex: '#FFC0CB' },
  { name: 'Đen', hex: '#000000' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Xám', hex: '#808080' },
  { name: 'Nâu', hex: '#A52A2A' },
  { name: 'Xanh lơ', hex: '#00FFFF' },
  { name: 'Hồng cánh sen', hex: '#FF00FF' },
  { name: 'Xanh lá nhạt', hex: '#00FF00' },
  { name: 'Xanh đậm', hex: '#4B0082' },
  { name: 'Tím nhạt', hex: '#EE82EE' },
];
export const getHexColor = (name) => {
  const color = colorsWithHex.find((item) => item.name === name);
  return color?.hex || '#000000';
};
export const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<Iconify icon="eva:arrow-ios-upward-fill" sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxHeight: 'calc(100% - 24px)',
  overflow: 'auto',
  maxWidth: 'calc(100% - 24px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
};

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
export const renderBrand = (id, brands) => {
  const brand = brands.find((item) => item._id === id);
  return brand?.name || 'Không tồn tại';
};
