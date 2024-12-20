import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useAuth } from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { logout as dangXuat } from 'src/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { renderUrl } from 'src/utils/check';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Trang chủ',
    icon: 'eva:home-fill',
    navigator: '/',
  },
  {
    label: 'Thông tin',
    icon: 'eva:person-fill',
    navigator: '/profile',
  },
  {
    label: 'Cài đặt',
    icon: 'eva:settings-2-fill',
    navigator: '/settings',
  },
];

// ----------------------------------------------------------------------
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

export default function AccountPopover() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(null);
  const [account, setAccount] = useState();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth.auth);

  useEffect(() => {
    if (data) {
      setAccount(data);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(null);
  };
  const handleLogout = () => {
    dispatch(dangXuat()).then((response) => {
      logout();
    });
  };

  const navigate = useNavigate();

  const handleMenuItemClick = (option) => {
    handleClose();
    if (option.navigator) {
      navigate(option.navigator);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={renderUrl(account?.avatar, backendUrl)}
          alt={account?.name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account?.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {account?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handleMenuItemClick(option)}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Đăng xuất
        </MenuItem>
      </Popover>
    </>
  );
}
