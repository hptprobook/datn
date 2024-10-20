import { useState } from 'react';

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Trang chủ',
    icon: 'eva:home-fill',
  },
  {
    label: 'Thông tin',
    icon: 'eva:person-fill',
  },
  {
    label: 'Cài đặt',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function MenuPopover({ menu, label = 'Menu', navigate }) {
  const [open, setOpen] = useState(null);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  return (
    <>
      <Button color="inherit" variant="contained" onClick={handleOpen}>
        {label}
      </Button>
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
        {menu.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
MenuPopover.defaultProps = {
  menu: MENU_OPTIONS,
};
MenuPopover.propTypes = {
  menu: PropTypes.array,
  label: PropTypes.string,
  navigate: PropTypes.func,
};
