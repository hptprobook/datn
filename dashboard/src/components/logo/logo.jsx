import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { ListItem, List, ListItemButton, ListItemIcon, ListItemText, Popper } from '@mui/material';
import Iconify from '../iconify';
// ----------------------------------------------------------------------

const Logo = forwardRef(({ sx, ...other }, ref) => {
  const theme = useTheme();

  const url = theme.palette.primary.light
    ? 'assets/images/logo/dark.png'
    : 'assets/images/logo/light.png';
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

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
        <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="eva:home-fill" />
                  </ListItemIcon>
                  <ListItemText primary="Inbox" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="eva:home-fill" />
                  </ListItemIcon>
                  <ListItemText primary="Drafts" />
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
