import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { account } from 'src/_mock/account';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Iconify from 'src/components/iconify/iconify';
import { useNavigate } from 'react-router-dom';
import navConfig from './config-navigation';
import { NAV } from './config-layout';

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const handleClick = () => {
    setOpen(!open);
  };
  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={account.photoURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{account.displayName}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {account.role}
        </Typography>
      </Box>
    </Box>
  );

  // const renderMenu = (
  //   <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
  //     {navConfig.map((item) => (
  //       <NavItem key={item.title} item={item} />
  //     ))}
  //     {/* <NavItem key={item.title} item={item} /> */}
  //   </Stack>
  // );
  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) =>
        item.child ? (
          <NavItems key={item.title} item={item} pathname={pathname} navigate={navigate} />
        ) : (
          <NavItem key={item.title} item={item} pathname={pathname} navigate={navigate} />
        )
      )}
    </Stack>
  );
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item, pathname, navigate }) {
  const handleClick = () => {
    navigate(item.path);
  };
  const active = item.path === pathname;
  return (
    <ListItemButton
      onClick={handleClick}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <ListItemIcon>
        <Iconify icon={item.icon} />
      </ListItemIcon>
      <ListItemText primary={item.title} />
    </ListItemButton>
  );
}
NavItem.propTypes = {
  item: PropTypes.object,
  pathname: PropTypes.string,
  navigate: PropTypes.func,
};

function NavItems({ item, pathname, navigate }) {
  const active = item.path === pathname;
  const handleClick = (path) => {
    navigate(path);
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton
        onClick={handleOpen}
      >
        <ListItemIcon>
          <Iconify icon={item.icon} />
        </ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <Iconify icon="mdi:expand-more" /> : <Iconify icon="ic:outline-expand-less" />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.child.map((child) => (
            <ListItemButton
            key={child.icon}
              sx={{
                pl: 4,
                mt: 0.5,
                mb: 0.5,
                minHeight: 44,
                borderRadius: 0.75,
                typography: 'body2',
                color: 'text.secondary',
                textTransform: 'capitalize',
                fontWeight: 'fontWeightMedium',
                ...(pathname === child.path && {
                  color: 'primary.main',
                  fontWeight: 'fontWeightSemiBold',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                  },
                }),
              }}
              onClick={() => handleClick(child.path)}
            >
              <ListItemIcon>
                <Iconify icon={child.icon} />
              </ListItemIcon>
              <ListItemText primary={child.title} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}
NavItems.propTypes = {
  item: PropTypes.object,
  pathname: PropTypes.string,
  navigate: PropTypes.func,
};
