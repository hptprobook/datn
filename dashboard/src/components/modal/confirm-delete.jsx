import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const ConfirmDelete = ({ onAgree, openConfirm, onClose, label, secondLabel }) => {
  const handleAgree = () => {
    onAgree();
    onClose(); // Close the dialog after agreeing
  };

  return (
    <Dialog
      open={openConfirm}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Xóa {label || 'lựa chọn'} này?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {secondLabel || 'Các hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Hủy
        </Button>
        <Button color="inherit" variant="contained" onClick={handleAgree} autoFocus>
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDelete.propTypes = {
  onAgree: PropTypes.func.isRequired,
  openConfirm: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired, // Add onClose prop to control the closing of the dialog
  label: PropTypes.string,
  secondLabel: PropTypes.string,
};

export default ConfirmDelete;
