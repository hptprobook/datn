import React from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

const EditableField = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  inputSelect,
  selectLabel = 'all',
  setInputSelect,
  handleUpdate,
  handleCancel,
}) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ gap: 1 }}>
    <TextField
      sx={{ flexGrow: 1 }}
      name={name}
      label={label}
      variant="standard"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      disabled={!(inputSelect === name || inputSelect === 'all' || inputSelect === selectLabel)}
    />
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      sx={{ display: inputSelect === name ? 'flex' : 'none' }}
    >
      <IconButton
        color="inherit"
        aria-label="Hủy"
        sx={{ width: 40, height: 40 }}
        onClick={() => handleCancel(name)}
      >
        <Iconify icon="eva:close-fill" />
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="Lưu"
        sx={{ width: 40, height: 40 }}
        onClick={() => handleUpdate(name)}
      >
        <Iconify icon="eva:save-fill" />
      </IconButton>
    </Stack>
    <IconButton
      color="inherit"
      aria-label="Chỉnh sửa"
      sx={{
        display:
          inputSelect === name || inputSelect === 'all' || inputSelect === selectLabel
            ? 'none'
            : 'block',
        width: 40,
        height: 40,
      }}
      onClick={() => setInputSelect(name)}
    >
      <Iconify icon="eva:edit-fill" />
    </IconButton>
  </Stack>
);

EditableField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  inputSelect: PropTypes.string,
  setInputSelect: PropTypes.func,
  handleUpdate: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  selectLabel: PropTypes.string,
};

export default EditableField;
