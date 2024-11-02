import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { List, Popper, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ sx, ...other }, ref) => {
  const theme = useTheme();
  const clientUrl = import.meta.env.VITE_REACT_CLIENT_URL;

  const url = theme.palette.primary.light
    ? '/assets/images/logo/dark.png'
    : '/assets/images/logo/light.png';
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const handleNavigate = (u, o) => {
    setAnchorEl(null);
    if (o === false) {
      window.open(u, '_blank');
    } else {
      navigate(u);
    }
  };
  // -------------------------------------------------------

  return (
    <div>
      <Box
        component="img"
        src={url}
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          ...sx,
        }}
      />
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        sx={{
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
          }}
        >
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    p: '0 12px',
                  }}
                  onClick={() => handleNavigate(clientUrl, true)}
                >
                  <ListItemIcon>
                    <Iconify icon="mdi:web" />
                  </ListItemIcon>
                  <ListItemText primary="Website" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    p: '0 12px',
                  }}
                  onClick={() => handleNavigate('/')}
                >
                  <ListItemIcon>
                    <Iconify icon="eva:home-fill" />
                  </ListItemIcon>
                  <ListItemText primary="Trang chủ" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    p: '0 12px',
                  }}
                  onClick={() => handleNavigate('/admin')}
                >
                  <ListItemIcon>
                    <Iconify icon="fa6-solid:warehouse" />
                  </ListItemIcon>
                  <ListItemText primary="Kho" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    p: '0 12px',
                  }}
                  onClick={() => handleNavigate('/pos')}
                >
                  <ListItemIcon>
                    <Iconify icon="mdi:network-pos" />
                  </ListItemIcon>
                  <ListItemText primary="POS" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Box>
      </Popper>
    </div>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
};

export default Logo;
