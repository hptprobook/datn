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
  ListItem,
  MenuItem,
  TableRow,
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
} from '@mui/material';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProduct } from 'src/redux/slices/posSlices';
import { renderUrl } from 'src/utils/check';
import { formatCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';
import { fetchAll } from 'src/redux/slices/warehouseSlices';
import { handleToast } from 'src/hooks/toast';
import Grid2 from '@mui/material/Unstable_Grid2';
import { IconDelete } from 'src/components/iconify/icon';
import { PropTypes } from 'prop-types';
import { formatDateTime } from 'src/utils/format-time';
import { useReactToPrint } from 'react-to-print';
import CountrySelect from 'src/sections/timetables/select-address';
import AddressService from 'src/redux/services/address.service';
import { getFee } from 'src/utils/requestGHN';
import { setStatus, createOrder } from 'src/redux/slices/orderSlices';
import LoadingFull from 'src/components/loading/loading-full';
// import { userSchema, productSchema } from './common/util';

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

export default function CreateOrderPage() {
  const [open, setOpen] = useState(false);
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
  const [openPrint, setOpenPrint] = useState(false);
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [address, setAddress] = useState('Vui lòng chọn địa chỉ');

  const dispatch = useDispatch();
  const status = useSelector((state) => state.pos.statusSearch);
  const products = useSelector((state) => state.pos.products);
  const staff = useSelector((state) => state.auth.auth);
  const warehouses = useSelector((state) => state.warehouses.warehouses);
  const statusCreate = useSelector((state) => state.orders.statusCreate);
  const error = useSelector((state) => state.orders.error);

  const contentRef = useRef(null);
  useEffect(() => {
    AddressService.getProvince().then((res) => {
      setProvince(res);
    });
  }, []);
  const handleChangeProvince = (p) => {
    setWard([]);
    setDistrict([]);
    setSelectedDistrict(''); // Reset district
    setSelectedWard(''); // Reset ward
    setSelectedProvince(p);
    if (p) {
      AddressService.getDistrict(p.ProvinceID).then((res) => {
        setDistrict(res);
      });
    }
  };

  const handleChangeDistrict = (d) => {
    setWard([]);
    setSelectedWard('');
    setSelectedDistrict(d);
    if (d) {
      AddressService.getWard(d.DistrictID).then((res) => {
        setWard(res);
      });
    }
  };

  const handleChangeWard = async (w) => {
    const selectedWarehouse = warehouses.find((wh) => wh._id === warehouse);
    if (!selectedWarehouse) {
      handleToast('error', 'Vui lòng chọn kho hàng');
      return;
    }
    if (receipt.productsList.length === 0) {
      handleToast('error', 'Đơn hàng không có sản phẩm');
      return;
    }
    if (!receipt.name || !receipt.phone || !receipt.email) {
      handleToast('error', 'Vui lòng nhập thông tin khách hàng');
      return;
    }

    setSelectedWard(w);
    const weight = receipt.productsList.reduce((total, product) => total + product.weight, 0);
    const dataGetFee = {
      from_district_id: selectedWarehouse.district_id,
      service_type_id: 2,
      to_district_id: selectedDistrict.DistrictID,
      to_ward_code: w.WardCode,
      weight,
    };

    await getFee('shipping-order/fee', dataGetFee).then((res) => {
      if (res.code === 200) {
        const fee = res.data.total;
        // Tạo bản sao mới của receipt
        const updatedReceipt = {
          ...receipt,
          fee,
          totalPayment: receipt.totalPrice + fee,
        };

        // Cập nhật lại receipt
        setReceipt(updatedReceipt);
      }
    });
  };

  useEffect(() => {
    if (receipts.length === 0) {
      setReceipts([
        {
          name: 'Khách tại quán',
          phone: null,
          orderCode: null,
          productsList: [],
          shippingInfo: {},
          totalPrice: 0,
          totalPayment: 0,
          fee: 0,
          paymentMethod: 'Tiền mặt',
          note: 'Nhân viên lên đơn',
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
      handleToast('success', 'Tạo đơn hàng thành công');
      const newArray = receipts.filter((_, index) => index !== value);
      setReceipts(newArray);
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
      setValue(0);
      setReceipt(receipts[0]);
    }
    if (statusCreate === 'failed') {
      console.log(error);
      handleToast('error', error?.messages || 'Tạo đơn hàng thất bại');
      dispatch(setStatus({ key: 'statusCreate', value: 'idle' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusCreate, error, value]);

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
        name: 'Khách tại quán',
        phone: null,
        orderCode: null,
        productsList: [],
        shippingInfo: {},
        totalPrice: 0,
        totalPayment: 0,
        fee: 0,
        paymentMethod: 'Tiền mặt',
        note: 'Nhân viên lên đơn',
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
        itemTotal: quantity * size.price,
        image: color.image,
        name: product.name,
        price: size.price,
        slug: product.slug,
        variantColor: color.color,
        variantSize: size.size,
        sku: color.sku,
        weight: product.weight,
      });
    }
    r.totalPrice += quantity * size.price;
    setReceipts([...receipts]);
    setQuantity(1);
  };
  const handleNote = (e) => {
    const r = receipts[value];
    r.note = e.target.value;
    setReceipts([...receipts]);
  };
  const handleValue = (e, type) => {
    const r = receipts[value];
    r[type] = e.target.value;
    setReceipts([...receipts]);
  };

  const handlePay = () => {
    const r = receipts[value];
    if (r.productsList.length === 0) {
      handleToast('error', 'Đơn hàng không có sản phẩm');
      return;
    }
    if (!r.name || !r.phone) {
      handleToast('error', 'Vui lòng nhập thông tin khách hàng');
      return;
    }
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      handleToast('error', 'Vui lòng chọn địa chỉ');
      return;
    }
    if (!warehouse) {
      handleToast('error', 'Vui lòng chọn kho hàng');
      return;
    }

    r.orderCode = `ODS${new Date().getTime()}`;
    r.shippingInfo = {
      detailAddress: address,
      districtCode: selectedDistrict.DistrictID,
      districtName: selectedDistrict.DistrictName,
      fullAddress: `${address}, ${selectedWard.WardName}, ${selectedDistrict.DistrictName}, ${selectedProvince.ProvinceName}`,
      name: r.name,
      phone: r.phone,
      provinceName: selectedProvince.ProvinceName,
      wardCode: selectedWard.WardCode,
      wardName: selectedWard.WardName,
      note: r.note,
    };
    delete r.name;
    delete r.phone;
    delete r.note;
    dispatch(createOrder(r));
    setReceipts([...receipts]);
  };
  const handleCloseReceipt = () => {
    const newArray = receipts.filter((_, index) => index !== value);
    setReceipts(newArray);
    setValue(0);
    setReceipt(receipts[0]);
  };
  const reactToPrintFn = useReactToPrint({ contentRef });
  const handleRemoveProduct = (i) => {
    const r = receipts[value];
    r.totalPrice -= r.productsList[i].quantity * r.productsList[i].price;
    r.productsList.splice(i, 1);
    setReceipts([...receipts]);
  };
  return (
    <Box>
      {statusCreate === 'loading' && <LoadingFull />}
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
              Đơn hàng - {openPrint && openPrint.receiptCode}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Tên khách hàng:</Typography>
              <Typography variant="body2">{openPrint && openPrint.name}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Tổng tiền:</Typography>
              <Typography variant="body2">
                {openPrint && formatCurrency(openPrint.totalPrice)}
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
        <Box sx={{ flexGrow: 1, maxWidth: '60vw' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {receipts.map((r, index) => (
              <Tab key={index} label={`Đơn hàng ${index + 1}`} />
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
        <Grid2 xs={12} md={7}>
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
          </Card>
        </Grid2>
        <Grid2 xs={12} md={5}>
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
              sx={{
                flexGrow: 1,
                p: 2,
                ...styleOverFlow,
              }}
              spacing={2}
            >
              <FormControl>
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
                  {warehouses?.map((w, index) => (
                    <MenuItem key={index} value={w._id}>
                      {w.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Tên khách hàng"
                variant="outlined"
                value={receipt?.name || ''}
                onChange={(e) => handleValue(e, 'name')}
              />
              <TextField
                label="Số điện thoại"
                variant="outlined"
                value={receipt?.phone || ''}
                onChange={(e) => handleValue(e, 'phone')}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={receipt?.email || ''}
                onChange={(e) => handleValue(e, 'email')}
              />
              <TextField
                label="Ghi chú"
                variant="outlined"
                value={receipt?.note || ''}
                onChange={handleNote}
              />
              <Grid2 container spacing={2}>
                <Grid2 xs={12} md={4}>
                  <CountrySelect
                    data={province}
                    query="ProvinceName"
                    onSelect={handleChangeProvince}
                  />
                </Grid2>
                <Grid2 xs={12} md={4}>
                  <CountrySelect
                    data={district}
                    query="DistrictName"
                    onSelect={handleChangeDistrict}
                  />
                </Grid2>
                <Grid2 xs={12} md={4}>
                  <CountrySelect data={ward} query="WardName" onSelect={handleChangeWard} />
                </Grid2>
                <Grid2 xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ chi tiết"
                    name="noteAddress"
                    value={address || ''}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid2>
              </Grid2>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="body1">Tổng tiền</Typography>
                <Typography variant="body1">{formatCurrency(receipt?.totalPrice)}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="body1">Phí giao hàng</Typography>
                <Typography variant="body1">{formatCurrency(receipt?.fee)}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="body1">Tiền phải trả</Typography>
                <Typography variant="body1">{formatCurrency(receipt?.totalPayment)}</Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                <Typography sx={{ width: '100%' }} variant="body1">
                  Phương thức thanh toán: Tiền mặt
                </Typography>
              </Stack>
            </Stack>
            <Button variant="contained" color="inherit" onClick={handlePay} sx={{ m: 2 }}>
              Thanh toán
            </Button>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
