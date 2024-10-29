import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
// Import the modal component
import { useState } from 'react';
import AddCustomerGroupModal from './AddCustomerGroupModal';

// ----------------------------------------------------------------------

export default function CustomerTableToolbar({ numSelected, filterName, onFilterName, onAddCustomerGroup }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddCustomerGroup = (customerGroup) => {
    onAddCustomerGroup(customerGroup);
  };

  return (
    <Toolbar
    sx={{
      height: 96,
      display: 'flex',
      justifyContent: 'space-between',
      p: (theme) => theme.spacing(0, 1, 0, 3),
      ...(numSelected > 0 && {
        color: 'primary.main',
        bgcolor: 'primary.lighter',
      }),
    }}
  >
    {numSelected > 0 ? (
      <Typography component="div" variant="subtitle1">
        {numSelected} selected
      </Typography>
    ) : (
      <OutlinedInput
        value={filterName}
        onChange={onFilterName}
        placeholder="Tìm kiếm Nhóm khách hàng..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />
    )}

    {numSelected > 0 ? (
      <Tooltip title="Delete">
        <IconButton>
          <Iconify icon="eva:trash-2-fill" />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Add Customer Group">
          <IconButton onClick={handleOpenModal}>
            <Iconify icon="eva:plus-fill" />
          </IconButton>
        </Tooltip>
    )}

    <AddCustomerGroupModal
      open={modalOpen}
      onClose={handleCloseModal}
      onAdd={handleAddCustomerGroup}
    />
  </Toolbar>
  );
}

CustomerTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onAddCustomerGroup: PropTypes.func.isRequired,
};
