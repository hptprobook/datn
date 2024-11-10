import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import Grid2 from '@mui/material/Unstable_Grid2';
import {
  Box,
  Modal,
  Select,
  styled,
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchAll as fetchWarehouses } from 'src/redux/slices/warehouseSlices';
import { fetchAll as fetchSupplier } from 'src/redux/slices/supplierSlices';
import { renderUrl } from 'src/utils/check';
import { formatCurrency } from 'src/utils/format-number';
import { handleToast } from 'src/hooks/toast';
import FormHelpTextError from 'src/components/errors/form-error';
import { setStatus, createReceipt } from 'src/redux/slices/receiptWarehouseSlices';
import * as XLSX from 'xlsx';
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
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

// ----------------------------------------------------------------------
const styleOverFlow = {
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px', // Width for vertical scrollbar
    height: '8px', // Height for horizontal scrollbar
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c4c4c4', // Color of the scrollbar thumb
    borderRadius: '4px', // Rounded edges
    '&:hover': {
      backgroundColor: '#a0a0a0', // Darker color on hover
    },
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f0f0f0', // Background color of the track
    borderRadius: '4px', // Rounded edges
  },
};
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  width: '80%',
  boxShadow: 24,
  p: 4,
};
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
export default function CreateReceiptWarehouse() {
  const dispatch = useDispatch();
  const [productList, setProductList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const suppliers = useSelector((state) => state.suppliers.suppliers);
  const warehouses = useSelector((state) => state.warehouses.warehouses);
  const statusCreate = useSelector((state) => state.receiptsWarehouse.statusCreate);
  const error = useSelector((state) => state.receiptsWarehouse.error);
  useEffect(() => {
    dispatch(fetchWarehouses());
    dispatch(fetchSupplier());
  }, [dispatch]);
  const createImportTemplate = () => {
    // Define the headers and an empty row as a template
    const data = [
      {
        sku: '',
        size: '',
        quantity: '',
        thumbnail: '',
        price: '',
        name: '',
        discount: '',
        note: 'Không',
        itemTotal: '',
      },
    ];

    // Create a new workbook and add the headers as a sheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Import Template');

    // Export the workbook as "import_template.xlsx"
    XLSX.writeFile(workbook, 'import_template.xlsx');
  };
  const importFromExcel = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Read file as binary string
      reader.readAsBinaryString(file);

      reader.onload = (e) => {
        const binaryStr = e.target.result;

        // Parse the file using XLSX
        const workbook = XLSX.read(binaryStr, { type: 'binary' });

        // Assuming data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Format data if needed, then resolve the promise
        resolve(data);
      };

      reader.onerror = (err) => reject(err);
    });
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const data = await importFromExcel(file);
        setDataList(data);
        // Expected format: Array of objects, each with keys SKU, Size, Quantity, Image, etc.
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };
  const handleSaveData = () => {
    handleClose();
    const total = dataList.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    formik.setFieldValue('totalPrice', total + formik.values.totalPrice);
    setProductList((prevList) => [...prevList, ...dataList]);
  };

  const formik = useFormik({
    initialValues: {
      statusPayment: 'Chưa thanh toán',
      warehouseId: '',
      discount: 0,
      supplierId: '',
      amountPaid: 0,
      totalPrice: 0,
      paymentMethod: 'Tiền mặt',
      note: 'Không',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const products = productList.map((product) => ({
        _id: product._id || null,
        sku: product.sku,
        size: product.size,
        quantity: Number(product.quantity),
        image: product.thumbnail,
        price: product.price,
        name: product.name,
        discount: product.discount || 0,
        note: 'Không',
        itemTotal: product.price * product.quantity,
      }));
      values.productsList = products;
      dispatch(createReceipt(values));
    },
  });
  useEffect(() => {
    if (statusCreate === 'successful') {
      handleToast('success', 'Tạo hóa đơn thành công');
      formik.resetForm();
      setProductList([]);
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
    if (statusCreate === 'failed') {
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
      handleToast('error', error.message || 'Tạo hóa đơn thất bại');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusCreate, error, dispatch]);
  const handleAddProduct = (p) => {
    if (productList.find((product) => product._id === p._id)) {
      const temp = productList.find((product) => product._id === p._id);
      temp.quantity += 1;
      const total = productList.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
      formik.setFieldValue('totalPrice', total);
      setProductList([...productList]);
      return;
    }
    const newP = structuredClone(p);
    newP.quantity = 1;
    newP.sku = newP.variants[0].sku;
    const total = productList.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);

    formik.setFieldValue('totalPrice', total + newP.price);
    newP.sizes = findSize(newP.variants[0].sku, newP.variants);
    newP.size = newP.sizes[0].size;
    setProductList([...productList, newP]);
  };
  const findSize = (sku, v) => v.find((item) => item.sku === sku).sizes;
  const handleSelectSku = (sku, index) => {
    const temp = productList;
    temp[index].sku = sku;
    temp[index].sizes = findSize(sku, temp[index].variants);
    setProductList([...temp]);
  };
  const handleSelectSize = (size, index) => {
    const temp = productList;
    temp[index].size = size;
    setProductList([...temp]);
  };
  const handleChangQuantity = (quantity, index) => {
    if (quantity < 1) {
      handleToast('error', 'Số lượng không thể nhỏ hơn 1');
      return;
    }
    const temp = productList;
    temp[index].quantity = quantity;
    const total = productList.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    formik.setFieldValue('totalPrice', total);
    setProductList([...temp]);
  };
  const handleRemoveProduct = (index) => {
    const temp = productList;
    temp.splice(index, 1);
    const total = productList.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    formik.setFieldValue('totalPrice', total);
    setProductList([...temp]);
  };
  return (
    <Grid2 container spacing={3}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Nhập từ file
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button onClick={createImportTemplate} variant="contained" color="inherit">
                Tạo file mẫu
              </Button>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            sx={{
              ...styleOverFlow,
              maxHeight: 600,
            }}
          >
            {dataList.length > 0 ? (
              dataList.map((data, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={2}>
                  <img src={data.thumbnail} alt={data.name} width={50} height={50} />
                  <Stack direction="column" flexGrow={1} spacing={1}>
                    <Typography
                      sx={{
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      {data.name}
                    </Typography>
                    <Typography>
                      {formatCurrency(data.price)} x {data.quantity}
                    </Typography>
                    <Typography> {formatCurrency(data.itemTotal)}</Typography>
                  </Stack>
                  <Typography>SKU: {data.sku}</Typography>
                  <Typography>Kích thước: {data.size}</Typography>
                  <Typography>Giảm giá: {data.discount}</Typography>
                  <Typography>Ghi chú: {data.note}</Typography>
                </Stack>
              ))
            ) : (
              <Typography id="modal-modal-description" sx={{ mt: 2, paddingY: 2 }}>
                Chọn file Excel để nhập dữ liệu
              </Typography>
            )}
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              color="inherit"
              tabIndex={-1}
              startIcon={<Iconify icon="flowbite:upload-solid" />}
            >
              Tải file lên
              <VisuallyHiddenInput type="file" onChange={handleFileUpload} multiple />
            </Button>
            <Button
              variant="contained"
              color="inherit"
              disabled={dataList.length === 0}
              onClick={handleSaveData}
            >
              Lưu
            </Button>
            <Button variant="contained" color="error" onClick={handleClose}>
              Đóng
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Grid2 xs={12} md={5}>
        <Card
          sx={{
            p: 3,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Stack direction="row" flexWrap="wrap" gap={2}>
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
                label="Giảm giá"
                variant="outlined"
                name="discount"
                value={formik.values.discount}
                onChange={formik.handleChange}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
              />
              <TextField
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
                  error={formik.touched.warehouseId && Boolean(formik.errors.warehouseId)}
                >
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelpTextError
                  label={formik.touched.warehouseId && formik.errors.warehouseId}
                />
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
                  error={formik.touched.supplierId && Boolean(formik.errors.supplierId)}
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier._id} value={supplier._id}>
                      {supplier.companyName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelpTextError label={formik.touched.supplierId && formik.errors.supplierId} />
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
      <Grid2 xs={12} md={7}>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Stack direction="column" spacing={2}>
            <Typography variant="h6">Danh sách sản phẩm</Typography>
            <Stack direction="row" spacing={2}>
              <ProductList onAddProduct={handleAddProduct} />
              <Button
                onClick={handleOpen}
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
              >
                Nhập từ file
              </Button>
            </Stack>
            <Stack
              direction="column"
              sx={{
                ...styleOverFlow,
                maxHeight: 400,
              }}
              spacing={2}
            >
              {productList.map((product, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={2}>
                  <img
                    src={renderUrl(product.thumbnail, backendUrl)}
                    alt={product.name}
                    width={50}
                    height={50}
                  />
                  <Stack direction="column" flexGrow={1} spacing={1}>
                    <Typography
                      sx={{
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography>{formatCurrency(product.price)}</Typography>
                  </Stack>
                  <TextField
                    sx={{ width: 100 }}
                    label="Số lượng"
                    variant="outlined"
                    value={product.quantity}
                    onChange={(e) => handleChangQuantity(e.target.value, i)}
                  />

                  {product.variants ? (
                    <>
                      {' '}
                      <FormControl>
                        <InputLabel id={`sku-select-label-${i}`}>Màu</InputLabel>
                        <Select
                          labelId={`sku-select-label-${i}`}
                          id={`sku-select-${i}`}
                          value={product.sku}
                          label="Màu"
                          sx={{ width: 100 }}
                          name="sku"
                          onChange={(e) => handleSelectSku(e.target.value, i)}
                        >
                          {product?.variants.map((v, index) => (
                            <MenuItem key={index} value={v.sku}>
                              {v.color}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel id={`size-select-label-${i}`}>Size</InputLabel>
                        <Select
                          labelId={`size-select-label-${i}`}
                          id={`size-select-${i}`}
                          value={product.size}
                          sx={{ width: 100 }}
                          label="Màu"
                          name="size"
                          onChange={(e) => handleSelectSize(e.target.value, i)}
                        >
                          {product.sizes?.map((size, index) => (
                            <MenuItem key={index} value={size.size}>
                              {size.size}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  ) : (
                    <Typography>
                      {product.sku} - {product.size}
                    </Typography>
                  )}
                  <IconButton onClick={() => handleRemoveProduct(i)}>
                    <Iconify icon="bx:bx-x" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>
      </Grid2>
    </Grid2>
  );
}
