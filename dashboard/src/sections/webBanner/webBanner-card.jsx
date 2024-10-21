import {
  Box,
  Stack,
  Button,
  CardMedia,
  Typography,
  CircularProgress,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { renderUrl } from 'src/utils/check';
import Divider from '@mui/material/Divider';
import Iconify from 'src/components/iconify';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

const WebBannerCard = ({ status, webBanner }) => {
 console.log('webBanner', webBanner);
 console.log('status', status);

  return (
    <>
      {status === 'loading' && (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'successful' && webBanner && (
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
                image={renderUrl(webBanner?.image, backendUrl)}
                alt="web banner image"
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                }}
              >
                <Stack direction="row" justifyItems="center" spacing={1}>
                  <Typography variant="body2">{webBanner?.views}</Typography>
                  <Iconify icon="eva:eye-fill" />
                </Stack>
              </Box>
            </Box>
            <Stack direction="column" spacing={2} mt={2} mb={2}>
              <Typography gutterBottom variant="h5" component="div">
                {webBanner?.title}
              </Typography>

              <Divider />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Mô tả :{' '}
                </span>{' '}
                {webBanner?.description}
              </Typography>
              <Divider />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Đường dẫn :{' '}
                </span>
                {webBanner?.url}
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
            onClick={() => window.open(webBanner?.url, '_blank')}
          >
            Xem banner quảng cáo trên trang web
          </Button>
        </Box>
      )}
    </>
  );
};

WebBannerCard.propTypes = {
  status: PropTypes.string,
  webBanner: PropTypes.any,
};

export default WebBannerCard;