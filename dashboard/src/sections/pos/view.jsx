import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
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
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProduct } from 'src/redux/slices/posSlices';
import { renderUrl } from 'src/utils/check';
import { formatCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';
import { fetchAll } from 'src/redux/slices/warehouseSlices';
import { handleToast } from 'src/hooks/toast';
import Grid2 from '@mui/material/Unstable_Grid2';

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
export default function PosPage() {
  const route = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
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
  }, [receipts]);

  const dispatch = useDispatch();
  const status = useSelector((state) => state.pos.statusSearch);
  const products = useSelector((state) => state.pos.products);
  const staff = useSelector((state) => state.auth.auth);
  const warehouses = useSelector((state) => state.warehouses.warehouses);
  useEffect(() => {
    if (staff) {
      dispatch(fetchAll());
    }
  }, [dispatch, staff]);
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
    console.log(receipts[i]);
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
    const product = products.products.find((p) => p._id === id);
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
    console.log(receipts);
  };
  return (
    <Box>
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
                  products?.products?.map((product) => (
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
        <Box sx={{ flexGrow: 1, maxWidth: '60vw' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {receipts.map((receipt, index) => (
              <Tab key={index} label={`Hóa đơn ${index + 1}`} />
            ))}
          </Tabs>
        </Box>
      </Stack>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={8}>
          <Card
            sx={{
              p: 2,
              borderRadius: 1,
              height: 'calc(100vh - 220px)',
            }}
          >
            <TableContainer>
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
                    receipt?.productsList.map((row) => (
                      <TableRow
                        key={row.name}
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Card>hell</Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
