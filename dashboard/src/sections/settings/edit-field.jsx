import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Button, TextField, IconButton } from '@mui/material';
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
    setInputSelect, 
    handleUpdate, 
    handleCancel 
}) => (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ gap: 1 }}>
        <TextField
            sx={{ flexGrow: 1 }}
            name={name}
            label={label}
            variant="outlined"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            helperText={helperText}
            disabled={!(inputSelect === name || inputSelect === 'all')}
        />
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ display: inputSelect === name ? 'flex' : 'none' }}
        >
            <Button variant="text" color="inherit" onClick={handleCancel}>
                Hủy
            </Button>
            <Button variant="contained" color="inherit" onClick={() => handleUpdate(name)}>
                Lưu
            </Button>
        </Stack>
        <IconButton
            color="inherit"
            aria-label="Chỉnh sửa"
            sx={{
                display: (inputSelect === name || inputSelect === 'all') ? 'none' : 'block',
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
};

export default EditableField;
