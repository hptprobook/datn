import { Stack, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import Iconify from 'src/components/iconify';
import { renderUrl } from 'src/utils/check';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
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
const ProductSelectedList = ({ products, onDelete }) => (
  <Stack
    spacing={2}
    sx={{
      mt: 2,
      maxHeight: '460px',
      ...styleOverFlow
    }}
  >
    {products.length > 0 ? (
      products.map((product) => (
        <Stack key={product._id} direction="row" alignItems="center" justifyContent="space-between">
          <img
            src={renderUrl(product.thumbnail, backendUrl)}
            alt={product.name}
            style={{ width: '50px', height: '50px' }}
          />
          <Typography>{product.name}</Typography>
          <IconButton onClick={() => onDelete(product._id)}>
            <Iconify icon="mdi:trash" />
          </IconButton>
        </Stack>
      ))
    ) : (
      <Typography>Không có sản phẩm được chọn</Typography>
    )}
  </Stack>
);

export default ProductSelectedList;
ProductSelectedList.propTypes = {
  products: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
};
