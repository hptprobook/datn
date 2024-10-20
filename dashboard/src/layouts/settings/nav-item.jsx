import { alpha, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';

export const NavItem = ({ item, pathname, navigate }) => {
  const handleClick = () => {
    navigate(item.path);
  };
  const active = item.path === pathname;
  return (
    <ListItemButton
      onClick={handleClick}
      sx={[
        {
          typography: 'body2',
          color: 'text.secondary',
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
        ]}
      >
        <Iconify icon={item.icon} />
      </ListItemIcon>
      <ListItemText
        primary={item.title}
        sx={[
          {
            m: 0,
            ml: 1,
          },
        ]}
      />
    </ListItemButton>
  );
};
NavItem.propTypes = {
  item: PropTypes.object,
  pathname: PropTypes.any,
  navigate: PropTypes.func,
};
