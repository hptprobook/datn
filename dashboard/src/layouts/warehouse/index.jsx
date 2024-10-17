import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useDispatch, useSelector } from 'react-redux';
import { getMe } from 'src/redux/slices/authSlice';
import LoadingFull from 'src/components/loading/loading-full';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function WarehouseLayout({ children }) {
  const auth = useSelector((state) => state.auth.auth);

  return auth ? (
    <>
      <Header />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Main>{children}</Main>
      </Box>
    </>
  ) : (
    <LoadingFull position="fixed" />
  );
}

WarehouseLayout.propTypes = {
  children: PropTypes.node,
};
