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
import Iconify from 'src/components/iconify';
import { parseContent } from './utils';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

const BlogCard = ({ status, blog, author }) => {
  useEffect(() => {
    // Any necessary effect when blog or status changes
  }, [blog, status]);

  return (
    <>
      {status === 'loading' && (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'successful' && blog && (
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
                image={renderUrl(blog?.thumbnail, backendUrl)}
                alt="blog thumbnail"
              />
          
            </Box>
            <Stack direction="column" spacing={2} mt={2} mb={2}>
              <Typography gutterBottom variant="h5" component="div">
                {blog?.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Tác giả :{' '}
                </span>{' '}
                {author}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Nội dung :{' '}
                </span>
                <Box>
                  {parseContent(blog?.content)}

                </Box>
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
            onClick={() => window.open(blog?.url, '_blank')}
          >
            Xem bài viết trên trang web
          </Button>
        </Box>
      )}
    </>
  );
};

BlogCard.propTypes = {
  status: PropTypes.string,
  blog: PropTypes.any,
  author: PropTypes.string,
};

export default BlogCard;