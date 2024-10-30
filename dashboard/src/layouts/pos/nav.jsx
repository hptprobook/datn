import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Iconify from 'src/components/iconify/iconify';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Divider, ListItem } from '@mui/material';
import { usePathname } from 'src/routes/hooks';
import navConfig from './config-pos';

export default function Nav({ open }) {
  const pathname = usePathname();
  const navigate = useNavigate();

  return (
    <List
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        '::-webkit-scrollbar': {
          display: 'none', // Ẩn thanh cuộn trên Chrome, Safari, Edge
          width: '4px', // Độ rộng của thanh cuộn
          height: '4px', // Chiều cao của thanh cuộn
        },
        ':hover': {
          '::-webkit-scrollbar': {
            display: 'block', // Hiện thanh cuộn khi hover
          },
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#888', // Màu của thanh kéo (thumb)
          borderRadius: '4px', // Độ bo góc của thanh kéo
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555', // Màu thanh kéo khi hover
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1', // Màu nền của thanh cuộn
        },
      }}
    >
      {navConfig.map((item, index) => (
        <ListItem key={index} disablePadding sx={{ display: 'block' }}>
          {item.child ? (
            <NavItems item={item} pathname={pathname} navigate={navigate} openMenu={open} />
          ) : (
            <NavItem item={item} pathname={pathname} navigate={navigate} openMenu={open} />
          )}
        </ListItem>
      ))}
    </List>
  );
}

export const NavItem = ({
  item,
  pathname,
  navigate,
  openMenu,
  iconShow,
  onOpenChild,
  parentActive,
}) => {
  const handleClick = () => {
    if (item.child && openMenu) {
      onOpenChild();
    } else {
      navigate(item.path);
    }
  };

  const active = item.path === pathname || parentActive;

  return (
    <ListItemButton
      onClick={handleClick}
      sx={[
        {
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
        },
        openMenu
          ? {
              justifyContent: 'initial',
            }
          : {
              justifyContent: 'center',
            },
      ]}
    >
      <ListItemIcon
        sx={[
          {
            minWidth: 0,
            justifyContent: 'center',
          },
          active && {
            color: 'primary.main',
          },
          openMenu && {
            mr: 3,
          },
        ]}
      >
        {!openMenu ? (
          <Tooltip title={item.title}>
            <Iconify icon={item.icon} />
          </Tooltip>
        ) : (
          <Iconify icon={item.icon} />
        )}
      </ListItemIcon>
      <ListItemText
        primary={item.title}
        sx={[
          {
            m: 0,
          },
          openMenu
            ? {
                opacity: 1,
              }
            : {
                opacity: 0,
              },
        ]}
      />
      {iconShow}
    </ListItemButton>
  );
};
NavItem.propTypes = {
  item: PropTypes.object,
  pathname: PropTypes.any,
  navigate: PropTypes.func,
  openMenu: PropTypes.bool,
  iconShow: PropTypes.node,
  onOpenChild: PropTypes.func,
  parentActive: PropTypes.bool,
};

function NavItems({ item, pathname, navigate, openMenu }) {
  const handleClick = (path) => {
    navigate(path);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (openMenu) {
      setOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!openMenu) {
      setOpen(false);
    }
  }, [openMenu]);

  return (
    <>
      <NavItem
        item={item}
        pathname={pathname}
        navigate={navigate}
        openMenu={openMenu}
        onOpenChild={handleOpen}
        parentActive={item.child.some((child) => child.path === pathname)}
        iconShow={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      />

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.child.map((child) => (
            <ListItemButton
              key={child.path}
              sx={{
                p: 0,
                pl: 4,
                pr: 2,
                color: 'text.secondary',
                fontWeight: 'fontWeightMedium',
                ...(pathname === child.path && {
                  color: 'primary.dark',
                  fontWeight: 'fontWeightSemiBold',
                  bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.08),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.16),
                  },
                }),
              }}
              onClick={() => handleClick(child.path)}
            >
              <ListItemText primary={child.title} />
            </ListItemButton>
          ))}
          <Divider />
        </List>
      </Collapse>
    </>
  );
}
NavItems.propTypes = {
  item: PropTypes.object,
  pathname: PropTypes.any,
  navigate: PropTypes.func,
  openMenu: PropTypes.bool,
};
Nav.propTypes = {
  open: PropTypes.bool,
};
