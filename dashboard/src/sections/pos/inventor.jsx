import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import {
  Box,
  List,
  Avatar,
  ListItem,
  TextField,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from 'src/redux/slices/posSlices';
import { formatCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';
import { renderUrl } from 'src/utils/check';

// ----------------------------------------------------------------------
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
const websiteUrl = import.meta.env.VITE_REACT_CLIENT_URL;
export default function TrackingInventorPage() {
  const route = useRouter();
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [productSelected, setProductSelected] = useState(null);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.pos.statusSearch);
  const products = useSelector((state) => state.pos.products);
  const handleSearch = useCallback(
    (e) => {
      const keyword = e.target.value;

      if (status !== 'loading' && keyword.length > 1) {
        if (searchTimeout) clearTimeout(searchTimeout);

        const timeout = setTimeout(() => {
          dispatch(searchProducts(keyword));
        }, 500);

        setSearchTimeout(timeout);
      }
    },
    [dispatch, status, searchTimeout]
  );
  const handleSelectProduct = (id) => {
    const product = products.find((p) => p._id === id);
    setSelectedColor(0);
    setColors(product.variants);
    setSizes(product.variants[0].sizes);
    setSelectedSize(0);
    setThumbnail(product.variants[0].image);
    setProductSelected(product);
  };
  return (
    <Container>
      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={6} lg={4}>
          <Card
            sx={{
              p: 3,
              height: '85vh',
            }}
          >
            <Stack
              direction="column"
              spacing={2}
              sx={{
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify icon="mdi:search" width={24} height={24} mr={2} />
                <TextField fullWidth label="Tìm kiếm sản phẩm" onChange={handleSearch} />
              </Box>
              <List
                sx={{
                  width: '100%',
                  flexGrow: 1,
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
                }}
              >
                {products ? (
                  products?.map((product) => (
                    <ListItem
                      key={product._id}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor:
                          productSelected?._id === product._id ? '#f0f0f0' : 'inherit',
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
            </Stack>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={6} lg={8}>
          <Card
            sx={{
              p: 3,
              height: '85vh',
            }}
          >
            {productSelected ? (
              <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                  <Typography variant="h6">Chi tiết sản phẩm</Typography>
                </Grid2>
                <Grid2 xs={12} md={6}>
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
                </Grid2>
                <Grid2 xs={12} md={6}>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h6">{productSelected.name}</Typography>
                    <Typography variant="body1">{sizes[selectedSize].sku}</Typography>
                    <Typography variant="body1">
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
                    <Button
                      startIcon={<Iconify icon="mdi:cart-plus" />}
                      variant="contained"
                      color="inherit"
                      onClick={() => route.push(`/admin/warehouse/receipts/create`)}
                    >
                      Nhập hàng
                    </Button>
                    <Button
                      variant="contained"
                      color="inherit"
                      startIcon={<Iconify icon="mdi:pencil" />}
                      onClick={() => route.push(`/admin/products/${productSelected._id}`)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="inherit"
                      startIcon={<Iconify icon="mdi:web" />}
                      onClick={() => window.open(`${websiteUrl}san-pham/${productSelected.slug}`)}
                    >
                      Xem trên website
                    </Button>
                  </Stack>
                </Grid2>
              </Grid2>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                Chọn sản phẩm để xem chi tiết
              </Typography>
            )}
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
