import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useDispatch, useSelector } from 'react-redux';
import { getMe } from 'src/redux/slices/authSlice';
import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const statusMe = useSelector((state) => state.auth.statusMe);
  const auth = useSelector((state) => state.auth.auth);
  useEffect(() => {
    if (auth === null && statusMe === 'idle') {
      dispatch(getMe());
    }
  }, [dispatch, statusMe, auth]);

  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
