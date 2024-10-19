import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Iconify from 'src/components/iconify/iconify';
import { Link, useNavigate } from 'react-router-dom';
import { Popover, Tooltip, ListItem, Typography, Button, Stack } from '@mui/material';
import { usePathname } from 'src/routes/hooks';
import navConfig from './config-navigation';

export default function Nav({ open }) {
  const pathname = usePathname();
  const navigate = useNavigate();

  return (
    <List>
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

function NavItem({ item, pathname, navigate, openMenu, iconShow, onOpenChild }) {
  const handleClick = () => {
    if (item.child) {
      onOpenChild();
    } else {
      navigate(item.path);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const active = item.path === pathname;

  return (
    <>
      <ListItemButton
        aria-owns={openPopover ? item.path : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
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

      <Popover
        onMouseEnter={handlePopoverOpen}
        id={item.path}
        sx={{
          pointerEvents: 'none',
        }}
        open={openPopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button onClick={() => navigate(item.path)}>
            <Typography variant="body2">{item.title}</Typography>
          </Button>
          <Button onClick={() => navigate(item.path)}>
            <Typography variant="body2">{item.title}</Typography>
          </Button>
          <Button onClick={() => navigate(item.path)}>
            <Typography variant="body2">{item.title}</Typography>
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
NavItem.propTypes = {
  item: PropTypes.object,
  pathname: PropTypes.string,
  navigate: PropTypes.func,
  openMenu: PropTypes.bool,
  iconShow: PropTypes.node,
  onOpenChild: PropTypes.func,
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
        iconShow={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      />

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
  openMenu: PropTypes.bool,
};
Nav.propTypes = {
  open: PropTypes.bool,
};
