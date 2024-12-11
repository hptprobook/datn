import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Iconify from 'src/components/iconify';
import {
  Box,
  Tab,
  Tabs,
  List,
  Modal,
  Table,
  Avatar,
  Select,
  Button,
  Popper,
  ListItem,
  MenuItem,
  TableRow,
  Checkbox,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  ListItemText,
  ListItemAvatar,
  TableContainer,
  FormControlLabel,
} from '@mui/material';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, searchUser, searchProduct } from 'src/redux/slices/posSlices';
import { renderUrl } from 'src/utils/check';
import { formatCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';
import { fetchAll } from 'src/redux/slices/warehouseSlices';
import { handleToast } from 'src/hooks/toast';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import { createReceipt, setStatus as setStatusCreate } from 'src/redux/slices/receiptSlices';
import { createUser, setStatus as setStatusCreateUser } from 'src/redux/slices/userSlice';
import { IconSave, IconDelete, IconCancel } from 'src/components/iconify/icon';
import { PropTypes } from 'prop-types';
import { formatDateTime } from 'src/utils/format-time';
import { useReactToPrint } from 'react-to-print';
import { userSchema, productSchema } from './common/util';

// ----------------------------------------------------------------------
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 10,
  borderRadius: 2,
  p: 2,
};
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
const FormField = React.memo(({ label, name, value, touched, error, handleChange }) => (
  <TextField
    label={label}
    name={name}
    value={value}
    onChange={handleChange}
    error={touched && Boolean(error)}
    helperText={touched && error}
  />
));
FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.string,
  handleChange: PropTypes.func,
};

export default function PosPage() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [receipts, setReceipts] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [warehouse, setWarehouse] = useState('');
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [productSelected, setProductSelected] = useState(null);
  const [addCustom, setAddCustom] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSuggest, setShowSuggest] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);

  const [isPrint, setIsPrint] = useState(false);

  const dispatch = useDispatch();
  const status = useSelector((state) => state.pos.statusSearch);
  const products = useSelector((state) => state.pos.products);
  const users = useSelector((state) => state.pos.users);
  const statusSearchUser = useSelector((state) => state.pos.statusSearchUser);
  const staff = useSelector((state) => state.auth.auth);
  const warehouses = useSelector((state) => state.warehouses.warehouses);
  const statusCreate = useSelector((state) => state.receipts.statusCreate);
  const error = useSelector((state) => state.receipts.error);
  const statusCreateUser = useSelector((state) => state.users.statusCreate);
  const dataUser = useSelector((state) => state.users.user);
  const errorCreateUser = useSelector((state) => state.users.error);

  const contentRef = useRef(null);

  useEffect(() => {
    if (receipts.length === 0) {
      setReceipts([
        {
          orderId: null,
          receiptCode: null,
          name: 'Khách tại quán',
          phone: '0901234567',
          total: 0,
          productsList: [],
          amountPaidBy: 0,
          amountPaidTo: 0,
          discount: 0,
          discountCode: null,
          paymentMethod: 'Tiền mặt',
          type: 'store',
          note: 'Mua sản phẩm tại cửa hàng',
        },
      ]);
    }
    if (receipts.length === 1) {
      setReceipt(receipts[0]);
    }
  }, [receipts, dispatch, value]);
  useEffect(() => {
    if (staff) {
      dispatch(fetchAll()).then((r) => {
        if (r.meta.requestStatus === 'fulfilled') {
          if (staff.role === 'root') {
            setWarehouse(warehouses[0]._id);
          } else {
            setWarehouse(staff.branchId);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff]);
  useEffect(() => {
    if (statusCreate === 'successful') {
      handleToast('success', 'Tạo hóa đơn thành công');
      if (isPrint) {
        setOpenPrint(receipts[value]);
      }
      const newArray = receipts.filter((_, index) => index !== value);
      setReceipts(newArray);
      dispatch(setStatusCreate({ key: 'statusCreate', value: 'idle' }));
      setValue(0);
      setReceipt(receipts[0]);
    }
    if (statusCreate === 'failed') {
      handleToast('error', error || 'Tạo hóa đơn thất bại');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusCreate, error, receipts, value]);
  useEffect(() => {
    if (statusCreateUser === 'successful') {
      handleToast('success', 'Tạo người dùng thành công');
      setSelectedUser(dataUser);
      setStatusCreateUser({ key: 'statusCreate', value: 'idle' });
      setStatusCreateUser({ key: 'error', value: null });
      setOpenModalAdd(false);
    }
    if (statusCreateUser === 'failed') {
      handleToast('error', errorCreateUser?.message || 'Tạo người dùng thất bại');
      setStatusCreateUser({ key: 'statusCreate', value: 'idle' });
      setStatusCreateUser({ key: 'error', value: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusCreateUser, errorCreateUser]);
  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      quantity: '',
      variantColor: 'Không',
      variantSize: 'Không',
      _id: null,
      image:
        'data:image/png;base64,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',
      sku: null,
      weight: 1,
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      const r = receipts[value];

      r.productsList.push({
        ...values,
      });
      r.total += values.price * values.quantity;
      setReceipts([...receipts]);
      formik.resetForm();
      setAddCustom(false);
    },
  });
  const formikUser = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      dispatch(createUser(values));
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSearch = useCallback(
    (e) => {
      const keyword = e.target.value;

      if (status !== 'loading' && keyword.length > 1) {
        if (searchTimeout) clearTimeout(searchTimeout);

        const timeout = setTimeout(() => {
          dispatch(searchProduct({ keyword, page: 1, limit: 10 }));
        }, 500);

        setSearchTimeout(timeout);
      }
    },
    [dispatch, status, searchTimeout]
  );
  const handleSearchUser = useCallback(
    (e) => {
      const keyword = e.target.value;

      if (status !== 'loading' && keyword.length > 0) {
        if (searchTimeout) clearTimeout(searchTimeout);

        const timeout = setTimeout(() => {
          dispatch(searchUser(keyword));
        }, 200);
        setSearchTimeout(timeout);
      }
    },
    [dispatch, status, searchTimeout]
  );
  const handleChange = (event, i) => {
    setValue(i);
    setReceipt(receipts[i]);
  };
  const handleChangeWarehouse = (event) => {
    if (staff.role !== 'root' && staff.brandId !== event.target.value) {
      handleToast('error', 'Bạn không có quyền truy cập kho hàng này');
      return;
    }
    setWarehouse(event.target.value);
  };
  const handleAddReceipt = () => {
    setReceipts([
      ...receipts,
      {
        orderId: null,
        receiptCode: null,
        name: 'Khách tại quán',
        phone: '0901234567',
        total: 0,
        productsList: [],
        amountPaidBy: 0,
        amountPaidTo: 0,
        discount: 0,
        discountCode: null,
        paymentMethod: 'Tiền mặt',
        type: 'store',
        note: 'Mua sản phẩm tại cửa hàng',
      },
    ]);
  };
  const handleQuantity = (t, s) => {
    if (t === 'plus') {
      if (quantity === s) {
        handleToast('error', 'Số lượng sản phẩm không thể lớn hơn số hàng hiện có');
        return;
      }
      setQuantity(quantity + 1);
    } else if (t === 'minus') {
      if (quantity === 1) {
        handleToast('error', 'Số lượng sản phẩm không thể nhỏ hơn 1');
        return;
      }
      setQuantity(quantity - 1);
    } else {
      if (t.target.value > s) {
        handleToast('error', 'Số lượng sản phẩm không thể lớn hơn số hàng hiện có');
        return;
      }
      setQuantity(Number(t.target.value));
    }
  };
  const handleSelectProduct = (id) => {
    const product = products.find((p) => p._id === id);
    setSelectedColor(0);
    setColors(product.variants);
    setSizes(product.variants[0].sizes);
    setSelectedSize(0);
    setThumbnail(product.variants[0].image);
    setProductSelected(product);
  };
  const handleAddCart = () => {
    const product = productSelected;
    const color = colors[selectedColor];
    if (staff.role !== 'root' && staff.branchId !== color.warehouseId) {
      handleToast('error', 'Sản phẩm này không thuộc quyền quản lý của bạn');
      return;
    }
    const size = sizes[selectedSize];
    const r = receipts[value];
    const productIndex = r.productsList.findIndex(
      (p) => p._id === product._id && p.variantSize === size.size && p.variantColor === color.color
    );
    if (productIndex !== -1) {
      const q = r.productsList[productIndex].quantity + quantity;
      if (q > size.stock) {
        handleToast('error', 'Số lượng sản phẩm không thể lớn hơn số hàng hiện có');
        return;
      }
      r.productsList[productIndex].quantity = q;
    } else {
      r.productsList.push({
        _id: product._id,
        quantity,
        image: color.image,
        name: product.name,
        price: size.price,
        variantColor: color.color,
        variantSize: size.size,
        sku: color.sku,
        weight: product.weight,
      });
    }
    r.total += quantity * size.price;
    setReceipts([...receipts]);
    setQuantity(1);
  };
  const handleSelectUser = (id) => {
    const user = users.result.find((u) => u._id === id);
    setAnchorEl(null);
    setSelectedUser(user);
  };
  const handleRemoveProduct = (i) => {
    const r = receipts[value];
    r.total -= r.productsList[i].quantity * r.productsList[i].price;
    r.productsList.splice(i, 1);
    setReceipts([...receipts]);
  };
  const handleNote = (e) => {
    const r = receipts[value];
    r.note = e.target.value;
    setReceipts([...receipts]);
  };

  const handleOpenSearch = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSearch = () => {
    setAnchorEl(null);
    dispatch(setStatus({ key: 'statusSearchUser', value: 'idle' }));
    dispatch(setStatus({ key: 'users', value: null }));
  };

  const openSearch = Boolean(anchorEl);
  const id = openSearch ? 'simple-popper' : undefined;
  const handleCalculate = (t, d) => t - d;
  // const handleChangePaymentMethod = (p) => {
  //   const r = receipts[value];
  //   r.paymentMethod = p;
  //   setReceipts([...receipts]);
  // };
  const roundingUnits = [10000, 20000, 50000, 100000, 200000, 500000];

  const handleChangeAmountPaidBy = (e) => {
    const r = receipts[value];
    const calculatedTotal = handleCalculate(r.total, r.discount);
    if (e?.target) {
      r.amountPaidBy = e.target.value;
    } else {
      r.amountPaidBy = e;
    }
    r.amountPaidTo = r.amountPaidBy - calculatedTotal;
    setReceipts([...receipts]);
  };
  const handlePay = () => {
    const r = receipts[value];
    const calculatedTotal = handleCalculate(r.total, r.discount);
    if (r.amountPaidBy < calculatedTotal) {
      handleToast('error', 'Số tiền khách đưa không đủ');
      return;
    }
    if (r.productsList.length === 0) {
      handleToast('error', 'Hóa đơn không có sản phẩm');
      return;
    }
    r.amountPaidTo = r.amountPaidBy - calculatedTotal;
    r.total = calculatedTotal;
    r.status = 'success';
    r.staffId = staff._id;
    r.receiptCode = `HD${new Date().getTime()}`;
    if (selectedUser) {
      r.phone = selectedUser.phone;
      r.name = selectedUser.name;
    }
    dispatch(createReceipt(r));
    setReceipts([...receipts]);
  };
  const handleCloseReceipt = () => {
    const newArray = receipts.filter((_, index) => index !== value);
    setReceipts(newArray);
    setValue(0);
    setReceipt(receipts[0]);
  };
  const reactToPrintFn = useReactToPrint({ contentRef });
  const getBrachName = (i) => {
    const branch = warehouses.find((w) => w._id === i);
    return branch?.name;
  };
  return (
    <Box>
      <Modal
        open={openPrint}
        onClose={() => setOpenPrint(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            ref={contentRef}
            direction="column"
            justifyContent="space-between"
            spacing={2}
            sx={{
              padding: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Hóa đơn - {openPrint && openPrint.receiptCode}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Tên khách hàng:</Typography>
              <Typography variant="body2">{openPrint && openPrint.name}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Tổng tiền:</Typography>
              <Typography variant="body2">
                {openPrint && formatCurrency(openPrint.total)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Kiểu thanh toán:</Typography>
              <Typography variant="body2">{openPrint && openPrint.paymentMethod}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Kiểu mua:</Typography>
              <Typography variant="body2">{openPrint && openPrint.type}</Typography>
            </Stack>
            <Stack direction="column" spacing={2}>
              <Typography variant="body1">Danh sách sản phẩm:</Typography>
              <List
                sx={{
                  mt: 0,
                }}
              >
                {openPrint &&
                  openPrint.productsList.map((item, i) => (
                    <ListItemText
                      key={i}
                      primary={`${item.name} - ${item.variantColor} - ${item.variantSize}`}
                      secondary={`${item.quantity} - ${formatCurrency(item.price)}`}
                    />
                  ))}
              </List>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Ngày tạo:</Typography>
              <Typography variant="body2">
                {openPrint && formatDateTime(openPrint.createdAt)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Ngày cập nhật:</Typography>
              <Typography variant="body2">
                {openPrint && formatDateTime(openPrint.updatedAt)}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={() => setOpenPrint(false)}>
              Đóng
            </Button>
            <Button variant="contained" color="inherit" onClick={reactToPrintFn}>
              In hóa đơn
            </Button>
            {/* <Button
              variant="contained"
              color='inherit'
              onClick={() => handleToast('info', 'Tính năng đang phát triển!')}
            >
              Chỉnh sửa
            </Button> */}
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
      >
        <Box sx={style}>
          <form onSubmit={formikUser.handleSubmit}>
            <Stack spacing={2}>
              <Typography id="modal-add-title" variant="h6" component="h2">
                Thêm khách hàng
              </Typography>
              <FormField
                label="Tên khách hàng"
                name="name"
                value={formikUser.values.name}
                touched={formikUser.touched.name}
                error={formikUser.errors.name}
                handleChange={formikUser.handleChange}
              />
              <FormField
                label="Email"
                name="email"
                value={formikUser.values.email}
                touched={formikUser.touched.email}
                error={formikUser.errors.email}
                handleChange={formikUser.handleChange}
              />
              <FormField
                label="Số điện thoại"
                name="phone"
                value={formikUser.values.phone}
                touched={formikUser.touched.phone}
                error={formikUser.errors.phone}
                handleChange={formikUser.handleChange}
              />
              <FormField
                label="Mật khẩu"
                name="password"
                value={formikUser.values.password}
                touched={formikUser.touched.password}
                error={formikUser.errors.password}
                handleChange={formikUser.handleChange}
              />
              <Button variant="contained" color="inherit" type="submit">
                Thêm
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="search-product-title"
        aria-describedby="search-product-description"
      >
        <Box sx={{ ...style, width: 800, maxWidth: '100%' }}>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              height: '90vh',
            }}
          >
            <Typography id="search-product-title" variant="h6" component="h2">
              Tìm sản phẩm
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify icon="mdi:search" width={24} height={24} mr={2} />
              <TextField fullWidth label="Tìm kiếm sản phẩm" onChange={handleSearch} />
            </Box>
            <Stack
              sx={{
                flexGrow: 1,
                overflow: 'auto',
              }}
              direction="row"
              spacing={2}
            >
              <List
                sx={{
                  width: '40%',
                  ...styleOverFlow,
                }}
              >
                {products ? (
                  products?.map((product) => (
                    <ListItem
                      key={product._id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      }}
                      onClick={() => handleSelectProduct(product._id)}
                    >
                      <ListItemAvatar>
                        <Avatar alt={product.name} src={renderUrl(product.thumbnail, backendUrl)} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            {formatCurrency(product.price)}{' '}
                            {product.inventory === 0 && (
                              <Label color="error" variant="filled">
                                Hết hàng
                              </Label>
                            )}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    {status === 'idle' ? (
                      <Typography variant="body1" color="textSecondary" align="center">
                        Nhập từ khóa để tìm kiếm
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary" align="center">
                        Không tìm thấy sản phẩm
                      </Typography>
                    )}
                  </ListItem>
                )}
              </List>
              <Box sx={{ width: '60%', ...styleOverFlow }}>
                {productSelected ? (
                  <Stack direction="row" flexWrap="wrap" gap={2}>
                    <Typography sx={{ width: '100%' }} variant="h6">
                      {productSelected.name}
                    </Typography>
                    <Stack direction="column" spacing={2}>
                      <img
                        src={thumbnail || renderUrl(productSelected.thumbnail, backendUrl)}
                        alt="product"
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      <Stack flexWrap="wrap" direction="row" gap={2}>
                        {colors.map((color, i) => (
                          <Avatar
                            width={50}
                            key={i}
                            alt={color.color}
                            src={renderUrl(color.image, backendUrl)}
                            sx={{
                              cursor: 'pointer',
                              border: selectedColor === i && '1px solid #222',
                            }}
                            onClick={() => {
                              setSelectedColor(i);
                              setSizes(color.sizes);
                              setThumbnail(color.image);
                              setSelectedSize(0);
                            }}
                          />
                        ))}
                      </Stack>
                      <Stack flexWrap="wrap" direction="row" gap={2}>
                        {sizes.map((color, i) => (
                          <Button
                            key={i}
                            variant={selectedSize === i ? 'contained' : 'outlined'}
                            color="inherit"
                            onClick={() => setSelectedSize(i)}
                          >
                            {color.size}
                          </Button>
                        ))}
                      </Stack>
                    </Stack>
                    <Typography sx={{ width: '100%' }} variant="body1">
                      {formatCurrency(sizes[selectedSize].price)}
                    </Typography>
                    <Typography variant="body1">Biến thể</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Typography variant="span" color="ButtonText">
                        Màu:
                      </Typography>{' '}
                      {colors[selectedColor].color}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Typography variant="span" color="ButtonText">
                        Kích thước:
                      </Typography>{' '}
                      {sizes[selectedSize].size}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Typography variant="span" color="ButtonText">
                        Tồn kho:
                      </Typography>{' '}
                      {sizes[selectedSize].stock}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Typography variant="span" color="ButtonText">
                        Đã bán:
                      </Typography>{' '}
                      {sizes[selectedSize].sale}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Typography variant="span" color="ButtonText">
                        Đang giao dịch:
                      </Typography>{' '}
                      {sizes[selectedSize].trading}
                    </Typography>
                    <Stack
                      sx={{
                        width: '100%',
                        mb: 2,
                      }}
                      direction="row"
                      flexWrap="wrap"
                      alignItems="center"
                      gap={2}
                    >
                      <IconButton
                        onClick={() => handleQuantity('minus', sizes[selectedSize].stock)}
                        variant="contained"
                        color="primary"
                        disabled={quantity === 1}
                      >
                        <Iconify icon="eva:minus-fill" />
                      </IconButton>
                      <TextField
                        value={quantity}
                        onChange={(e) => handleQuantity(e, sizes[selectedSize].stock)}
                        type="number"
                        sx={{ width: 100 }}
                      />
                      <IconButton
                        onClick={() => handleQuantity('plus', sizes[selectedSize].stock)}
                        variant="contained"
                        color="primary"
                        disabled={quantity === sizes[selectedSize].stock}
                      >
                        <Iconify icon="eva:plus-fill" />
                      </IconButton>
                      <Button variant="contained" color="inherit" onClick={handleAddCart}>
                        Thêm vào giỏ hàng
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Typography variant="body1" color="textSecondary" align="center">
                    Chọn sản phẩm để xem thông tin
                  </Typography>
                )}
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Stack direction="row" alignItems="center" spacing={4} mb={5}>
        <IconButton onClick={handleOpen} variant="contained" color="primary">
          <Iconify icon="eva:search-fill" />
        </IconButton>
        <IconButton onClick={handleAddReceipt} variant="contained" color="primary">
          <Iconify icon="eva:plus-fill" />
        </IconButton>
        {staff?.role === 'root' ? (
          <FormControl
            sx={{
              width: 180,
            }}
          >
            <InputLabel id="warehouse-select-label">Kho</InputLabel>
            <Select
              labelId="warehouse-select-label"
              id="warehouse-select"
              variant="filled"
              value={warehouse}
              label="Kho"
              sx={{
                height: '100%',
              }}
              onChange={handleChangeWarehouse}
            >
              {' '}
              {warehouses?.map((w, index) => (
                <MenuItem key={index} value={w._id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="h6">Kho: {getBrachName(staff?.branchId)}</Typography>
        )}
        <Box sx={{ flexGrow: 1, maxWidth: '60vw' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {receipts.map((r, index) => (
              <Tab key={index} label={`Hóa đơn ${index + 1}`} />
            ))}
          </Tabs>
        </Box>
        <IconButton
          onClick={handleCloseReceipt}
          disabled={receipts.length === 1 && true}
          variant="contained"
        >
          <Iconify icon="mdi:close" />
        </IconButton>
      </Stack>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={8}>
          <form onSubmit={formik.handleSubmit}>
            <Card
              sx={{
                p: 2,
                borderRadius: 1,
                height: 'calc(100vh - 220px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TableContainer
                sx={{
                  flexGrow: 1,
                  ...styleOverFlow,
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell align="right">Giá</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Màu</TableCell>
                      <TableCell align="right">Kích thước</TableCell>
                      <TableCell align="right"> </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {addCustom && (
                      <TableRow>
                        <TableCell>
                          <FormField
                            label="Tên sản phẩm"
                            name="name"
                            value={formik.values.name}
                            touched={formik.touched.name}
                            error={formik.errors.name}
                            handleChange={formik.handleChange}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormField
                            label="Giá"
                            name="price"
                            value={formik.values.price}
                            touched={formik.touched.price}
                            error={formik.errors.price}
                            handleChange={formik.handleChange}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormField
                            label="Số lượng"
                            name="quantity"
                            value={formik.values.quantity}
                            touched={formik.touched.quantity}
                            error={formik.errors.quantity}
                            handleChange={formik.handleChange}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormField
                            label="Màu"
                            name="variantColor"
                            value={formik.values.variantColor}
                            touched={formik.touched.variantColor}
                            error={formik.errors.variantColor}
                            handleChange={formik.handleChange}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormField
                            label="Kích thước"
                            name="variantSize"
                            value={formik.values.variantSize}
                            touched={formik.touched.variantSize}
                            error={formik.errors.variantSize}
                            handleChange={formik.handleChange}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row">
                            <IconButton onClick={() => setAddCustom(false)}>
                              <IconCancel />
                            </IconButton>
                            <IconButton onClick={formik.handleSubmit}>
                              <IconSave />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )}
                    {receipt?.productsList.length > 0 &&
                      receipt?.productsList.map((row, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <img
                              src={renderUrl(row.image, backendUrl)}
                              alt=""
                              height={50}
                              width={50}
                              style={{
                                borderRadius: 1,
                                objectFit: 'cover',
                              }}
                            />
                            <Typography variant="body1" color="textPrimary">
                              {row.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{formatCurrency(row.price)}</TableCell>
                          <TableCell align="right">{row.quantity}</TableCell>
                          <TableCell align="right">{row.variantColor}</TableCell>
                          <TableCell align="right">{row.variantSize}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleRemoveProduct(i)}>
                              <IconDelete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <TextField label="Ghi chú" value={receipt?.note || ''} onChange={handleNote} />
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => setAddCustom(!addCustom)}
                >
                  Thêm sản phẩm tùy chỉnh
                </Button>
              </Stack>
            </Card>
          </form>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 1,
              height: 'calc(100vh - 220px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{
                p: 2,
                borderBottom: 1,
              }}
            >
              <Iconify icon="mdi:person" />
              {selectedUser ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack>
                    <Typography variant="body1">{selectedUser.name}</Typography>
                    <Typography variant="body2">{selectedUser.email}</Typography>
                  </Stack>
                  <IconButton onClick={() => setSelectedUser(null)}>
                    <Iconify icon="mdi:close" />
                  </IconButton>
                </Stack>
              ) : (
                <TextField
                  aria-describedby={id}
                  label="Tìm kiếm khách hàng"
                  fullWidth
                  variant="standard"
                  onClick={handleOpenSearch}
                  onChange={handleSearchUser}
                  autoComplete="off"
                />
              )}
              <Popper id={id} open={openSearch} anchorEl={anchorEl}>
                <Box
                  sx={{
                    border: 1,
                    p: 1,
                    width: anchorEl && anchorEl.clientWidth,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Stack direction="column">
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1">Thông tin khách hàng</Typography>
                      <IconButton onClick={handleCloseSearch}>
                        <Iconify icon="mdi:close" />
                      </IconButton>
                    </Stack>
                    <List
                      sx={{
                        maxHeight: '400px',
                        ...styleOverFlow,
                      }}
                    >
                      {statusSearchUser === 'successful' &&
                        users?.result.map((user) => (
                          <ListItem
                            key={user._id}
                            onClick={() => handleSelectUser(user._id)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#f0f0f0',
                              },
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt={user.name}
                                src={renderUrl(user.avatar || '', backendUrl)}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={user.name}
                              secondary={
                                <Typography variant="body2" color="textSecondary">
                                  {user.phone}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Stack>
                </Box>
              </Popper>
              <IconButton onClick={() => setOpenModalAdd(true)}>
                <Iconify icon="mdi:plus" />
              </IconButton>
            </Stack>
            <Stack
              sx={{
                flexGrow: 1,
                p: 2,
                ...styleOverFlow,
              }}
              spacing={2}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="body1">Tổng tiền</Typography>
                <Typography variant="body1">{formatCurrency(receipt?.total)}</Typography>
              </Stack>
              {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="body1">Giảm giá</Typography>
                <Typography variant="body1">{formatCurrency(receipt?.discount)}</Typography>
              </Stack> */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="body1">Khách phải trả</Typography>
                <Typography variant="body1">
                  {formatCurrency(handleCalculate(receipt?.total, receipt?.discount))}
                </Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                <Typography sx={{ width: '100%' }} variant="body1">
                  Phương thức thanh toán: Tiền mặt
                </Typography>
                {/* <Button
                  variant={receipt?.paymentMethod === 'Tiền mặt' ? 'contained' : 'outlined'}
                  color="inherit"
                  onClick={() => handleChangePaymentMethod('Tiền mặt')}
                  endIcon={<Iconify icon="mdi:cash" />}
                >
                  Tiền mặt
                </Button>
                <Button
                  variant={receipt?.paymentMethod === 'Chuyển khoản' ? 'contained' : 'outlined'}
                  color="inherit"
                  onClick={() => handleChangePaymentMethod('Chuyển khoản')}
                  endIcon={<Iconify icon="mdi:bank" />}
                >
                  Chuyển khoản
                </Button>
                <Button
                  variant={receipt?.paymentMethod === 'VNPAY' ? 'contained' : 'outlined'}
                  color="inherit"
                  onClick={() => handleChangePaymentMethod('VNPAY')}
                  endIcon={<Iconify icon="solar:card-bold" />}
                >
                  Thẻ
                </Button> */}
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                <Typography sx={{ width: '100%' }} variant="body1">
                  Tiền khách đưa
                  <IconButton onClick={() => setShowSuggest(!showSuggest)}>
                    <Iconify icon={showSuggest ? 'mdi:eye' : 'mdi:eye-off'} />
                  </IconButton>
                </Typography>
                {showSuggest &&
                  roundingUnits.map(
                    (unit) =>
                      unit >= handleCalculate(receipt?.total, receipt?.discount) && (
                        <Button
                          key={unit}
                          variant={receipt?.amountPaidBy === unit ? 'contained' : 'outlined'}
                          color="inherit"
                          onClick={() => handleChangeAmountPaidBy(unit)}
                        >
                          {formatCurrency(unit)}
                        </Button>
                      )
                  )}
                <TextField
                  label="Số tiền khác"
                  type="number"
                  size="small"
                  variant="standard"
                  value={receipt?.amountPaidBy ? Number(receipt?.amountPaidBy) : Number(0)}
                  onChange={handleChangeAmountPaidBy}
                />
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="body1">Tiền thừa</Typography>
                <Typography variant="body1">{formatCurrency(receipt?.amountPaidTo)}</Typography>
              </Stack>
            </Stack>
            <Stack
              sx={{ p: 2 }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => setIsPrint(e.target.value)}
                    checked={isPrint}
                    value={isPrint}
                  />
                }
                label="In hóa đơn"
              />
              {/* <Button
                variant="contained"
                color="inherit"
                onClick={() => handleToast('info', 'Tính năng đang phát triển!')}
              >
                Mã giảm giá
              </Button> */}
              <Button variant="contained" color="inherit" onClick={handlePay}>
                Thanh toán
              </Button>
            </Stack>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
