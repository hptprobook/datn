import {
  Box,
  List,
  Stack,
  Button,
  Avatar,
  Drawer,
  ListItem,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import { searchProducts } from 'src/redux/slices/posSlices';
import { renderUrl } from 'src/utils/check';
import { formatCurrency } from 'src/utils/format-number';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
export const ProductList = ({ onAddProduct }) => {
  const [open, setOpen] = React.useState(false);

  const [searchTimeout, setSearchTimeout] = useState(null);
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

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <Stack>
      <Drawer
        open={open}
        sx={{
          zIndex: 99999999,
        }}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: 600, padding: 2 }} role="presentation">
          <Stack spacing={2}>
            <Typography id="modal-productList-title" variant="h6" component="h2">
              Thêm sản phẩm
            </Typography>
            <TextField
              id="search-product"
              label="Tìm kiếm sản phẩm"
              variant="outlined"
              onChange={handleSearch}
            />
            <List>
              {products?.map((product) => (
                <ListItem key={product._id}>
                  <ListItemAvatar>
                    <Avatar alt={product.name} src={renderUrl(product.thumbnail, backendUrl)} />
                  </ListItemAvatar>
                  <ListItemText primary={product.name} secondary={formatCurrency(product.price)} />
                  <ListItemSecondaryAction onClick={() => onAddProduct(product)}>
                    <IconButton edge="end" aria-label="add">
                      <Iconify icon="mdi:add" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Box>
      </Drawer>

      <Button
        variant="contained"
        color="inherit"
        onClick={toggleDrawer(true)}
        startIcon={<Iconify icon="bx:bxs-plus-circle" />}
      >
        Thêm sản phẩm
      </Button>
    </Stack>
  );
};
ProductList.propTypes = {
  onAddProduct: PropTypes.func,
};
