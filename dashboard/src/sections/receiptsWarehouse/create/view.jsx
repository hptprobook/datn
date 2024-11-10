import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchAll as fetchWarehouses } from 'src/redux/slices/warehouseSlices';
import { fetchAll as fetchSupplier } from 'src/redux/slices/supplierSlices';
import { ProductList } from '../product-list';

const schema = Yup.object().shape({
  statusPayment: Yup.string()
    .oneOf(['Chưa thanh toán', 'Đã thanh toán', 'Đang xử lý'], 'Trạng thái thanh toán không hợp lệ')
    .required('Trạng thái thanh toán là bắt buộc'),

  warehouseId: Yup.string()
    .length(24, 'Mã kho phải là chuỗi 24 ký tự')
    .required('Mã kho là bắt buộc'),

  discount: Yup.number().min(0, 'Giảm giá không thể là số âm').required('Giảm giá là bắt buộc'),

  supplierId: Yup.string()
    .length(24, 'Mã nhà cung cấp phải là chuỗi 24 ký tự')
    .required('Mã nhà cung cấp là bắt buộc'),

  amountPaid: Yup.number()
    .min(0, 'Số tiền đã thanh toán không thể là số âm')
    .required('Số tiền đã thanh toán là bắt buộc'),

  totalPrice: Yup.number().min(0, 'Tổng tiền không thể là số âm').required('Tổng tiền là bắt buộc'),

  paymentMethod: Yup.string()
    .oneOf(['Tiền mặt', 'Chuyển khoản', 'Thẻ'], 'Phương thức thanh toán không hợp lệ')
    .required('Phương thức thanh toán là bắt buộc'),

  note: Yup.string().max(200, 'Ghi chú không thể vượt quá 200 ký tự').nullable(), // Cho phép trường này có thể là `null` hoặc bỏ trống
});
// ----------------------------------------------------------------------

export default function CreateReceiptWarehouse() {
  const dispatch = useDispatch();
  const [productList, setProductList] = useState([]);
  const suppliers = useSelector((state) => state.suppliers.suppliers);
  const warehouses = useSelector((state) => state.warehouses.warehouses);
  useEffect(() => {
    dispatch(fetchWarehouses());
    dispatch(fetchSupplier());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      statusPayment: 'Chưa thanh toán',
      warehouseId: '',
      discount: 0,
      supplierId: '',
      amountPaid: 0,
      totalPrice: 0,
      paymentMethod: 'Tiền mặt',
      note: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const handleAddProduct = (p) => {
    if (productList.find((product) => product._id === p._id)) {
      const temp = productList.find((product) => product._id === p._id);
      temp.quantity += 1;
      setProductList([...productList]);
      return;
    };
    const newP = structuredClone(p);
    newP.quantity = 1;
    setProductList([...productList, newP]);
    
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Nhập kho</Typography>
      </Stack>

      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={6}>
          <Card
            sx={{
              p: 3,
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h6">Thông tin hóa đơn</Typography>
                <TextField
                  fullWidth
                  label="Tổng tiền"
                  variant="outlined"
                  name="totalPrice"
                  value={formik.values.totalPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.totalPrice && Boolean(formik.errors.totalPrice)}
                  helperText={formik.touched.totalPrice && formik.errors.totalPrice}
                />
                <TextField
                  fullWidth
                  label="Giảm giá"
                  variant="outlined"
                  name="discount"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  error={formik.touched.discount && Boolean(formik.errors.discount)}
                  helperText={formik.touched.discount && formik.errors.discount}
                />
                <TextField
                  fullWidth
                  label="Số tiền đã thanh toán"
                  variant="outlined"
                  name="amountPaid"
                  value={formik.values.amountPaid}
                  onChange={formik.handleChange}
                  error={formik.touched.amountPaid && Boolean(formik.errors.amountPaid)}
                  helperText={formik.touched.amountPaid && formik.errors.amountPaid}
                />
                <FormControl fullWidth>
                  <InputLabel id="warehouse-select-label">Nhà kho</InputLabel>
                  <Select
                    labelId="warehouse-select-label"
                    id="warehouse-select"
                    value={formik.values.warehouseId}
                    label="Nhà kho"
                    name="warehouseId"
                    onChange={formik.handleChange}
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse._id} value={warehouse._id}>
                        {warehouse.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="supplier-select-label">Nhà cung cấp</InputLabel>
                  <Select
                    labelId="supplier-select-label"
                    id="supplier-select"
                    value={formik.values.supplierId}
                    name="supplierId"
                    label="Nhà cung cấp"
                    onChange={formik.handleChange}
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier._id} value={supplier._id}>
                        {supplier.companyName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="payment-method-select-label">Phương thức thanh toán</InputLabel>
                  <Select
                    labelId="payment-method-select-label"
                    id="payment-method-select"
                    value={formik.values.paymentMethod}
                    name="paymentMethod"
                    label="Phương thức thanh toán"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                    <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                    <MenuItem value="Thẻ">Thẻ</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  variant="outlined"
                  name="note"
                  multiline
                  rows={4}
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  error={formik.touched.note && Boolean(formik.errors.note)}
                  helperText={formik.touched.note && formik.errors.note}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  startIcon={<Iconify icon="bx:bxs-save" />}
                >
                  Lưu
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Card
            sx={{
              p: 3,
            }}
          >
            <Stack direction="column" spacing={2}>
              <Typography variant="h6">Danh sách sản phẩm</Typography>
              <ProductList onAddProduct={handleAddProduct} />
              {productList.map((product) => (
                <Stack
                  key={product._id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{product.name}</Typography>
                  <Typography>{product.quantity}</Typography>
                  <Typography>{product.price}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
