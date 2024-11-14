import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, Typography } from '@mui/material';
import Logo from 'src/components/logo';
import Header from './header';
import Nav, { NavItem } from './nav';
import navConfig from './config-navigation';

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // boxShadow: 'none',
  backgroundColor: theme.palette.background.paper,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

export default function AdminLayout({ children }) {


  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const { pathname } = useLocation();
  React.useEffect(() => {
    if (pathname.includes('settings')) {
      setOpen(false);
    }
  }, [pathname]);
  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, []);
  const findTitleByPath = (items, targetPath) => 
     items
      .map(item => {
        // Check if the current item's path matches
        if (item.path === targetPath) return item.title;
  
        // If the item has children, recursively search within `child`
        if (item.child) return findTitleByPath(item.child, targetPath);
  
        return null; // Return null if no match
      })
      .find(title => title) // Find the first non-null title
  ;
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            aria-label="Mở menu"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: 'text.primary',
            }}
          >
            {findTitleByPath(navConfig, pathname)}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Header />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: 'flex',
        }}
        open={open}
      >
        <DrawerHeader
          sx={{
            display: 'flex',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
            }}
          >
            {/* <BmtLifeLogo /> */}
            <Logo />
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <Iconify icon="eva:chevron-right-fill" />
            ) : (
              <Iconify icon="eva:chevron-left-fill" />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <Divider />
        <Nav open={open} />
        {/* <Box sx={{ flexGrow: 1 }} /> */}
        <Divider />
        <List>
          <NavItem
            item={{
              title: 'Cài đặt',
              path: '/admin/settings',
              icon: 'ion:settings',
              child: undefined,
            }}
            navigate={navigate}
            pathname={pathname}
            openMenu={open}
          />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          position: 'relative',
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
AdminLayout.propTypes = {
  children: PropTypes.node,
};
