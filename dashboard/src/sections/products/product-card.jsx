import {
  Box,
  Stack,
  Button,
  CardMedia,
  Typography,
  CircularProgress,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { renderUrl } from 'src/utils/check';
import Divider from '@mui/material/Divider';
import { formatCurrency } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import { renderStatusStock, renderStatusStockColor } from 'src/utils/format-text';
import Label from 'src/components/label';
import { getHexColor } from './utils';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
const ProductCard = ({ status, product, brand }) => {
  const [color, setColor] = React.useState(null);
  const [sizes, setSizes] = React.useState([]);
  useEffect(() => {
    if (product && status === 'successful') {
      setColor(product.variants[0].color);
      setSizes(product.variants[0].sizes);
    }
  }, [product, status]);
//   const [variantSize, setVariantSize] = React.useState({});
  const handleSelectColor = (c) => {
    setColor(c);
    setSizes(product.variants.find((variant) => variant.color === c).sizes);
  };
  return (
    <>
      {status === 'loading' && (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'successful' && product && (
        <Box
          sx={{
            position: 'relative',
            maxWidth: '100%',
            width: 400,
            padding: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                position: 'relative',
              }}
            >
              <CardMedia
                component="img"
                image={renderUrl(product?.thumbnail, backendUrl)}
                alt="product thumbnail"
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                }}
              >
                <Stack direction="row" justifyItems="center" spacing={1}>
                  <Typography variant="body2">{product?.inventory}</Typography>
                  <Iconify icon="eva:clipboard-fill" />
                  <Typography variant="body2">{product?.view}</Typography>
                  <Iconify icon="eva:eye-fill" />
                </Stack>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
              >
                <Label
                  color={renderStatusStockColor(product?.statusStock)}
                  startIcon={
                    <Iconify icon={product?.status ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  }
                >
                  {renderStatusStock(product?.statusStock)}
                </Label>
              </Box>
            </Box>
            <Stack direction="column" spacing={2} mt={2} mb={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {product?.tags.map((tag, i) => (
                  <Label key={i} color="primary">
                    {tag}
                  </Label>
                ))}
                {product?.productType.map((type, i) => (
                  <Label key={i} color="success">
                    {type}
                  </Label>
                ))}
              </Stack>
              <Typography gutterBottom variant="h5" component="div">
                {product?.name}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                Giá: {formatCurrency(product?.price)}
              </Typography>
              <Stack direction="row" flexWrap='wrap' spacing={1} mb={2}>
                {product?.variants.map((variant, i) => (
                  <Box
                    key={i}
                    sx={{
                      cursor: 'pointer',
                      padding: '2px',
                      border: '1px solid',
                      borderColor: color === variant.color ? 'primary.main' : 'transparent',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => handleSelectColor(variant.color)}
                  >
                    <Box
                      sx={{
                        height: 24,
                        width: 24,
                        borderRadius: '50%',
                        backgroundColor: getHexColor(variant.color),
                      }}
                    />
                  </Box>
                ))}
              </Stack>
              <Stack direction="row" justifyItems="center" spacing={1} mb={2}>
                {sizes?.map((size, i) => (
                  <Box
                    key={i}
                    sx={{
                      cursor: 'pointer',
                      padding: '2px 8px',
                      border: '1px solid #ccc',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{size.size}</Typography>
                  </Box>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Nhãn hàng :{' '}
                </span>{' '}
                {brand}
              </Typography>

              <Divider />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Mô tả ngắn:{' '}
                </span>{' '}
                {product?.description}
              </Typography>
              <Divider />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Mô tả :{' '}
                </span>
                {product?.content}
              </Typography>
            </Stack>
          </Box>
          <Button
            variant="contained"
            color="inherit"
            sx={{
              borderRadius: 0,
            }}
            fullWidth
          >
            Xem sản phẩm trên trang web
          </Button>
        </Box>
      )}
    </>
  );
};

export default ProductCard;
ProductCard.propTypes = {
  status: PropTypes.string,
  product: PropTypes.any,
  brand: PropTypes.string,
};
