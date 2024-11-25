import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { PropTypes } from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalHelper({ openModal, onClose }) {
  return (
    <Modal
      open={openModal}
      onClose={() => onClose()}
      aria-labelledby="modal-hepper-title"
      aria-describedby="modal-hepper-description"
    >
      <Box sx={style}>
        <Typography id="modal-hepper-title" variant="h6" component="h2">
          Hướng dẫn sử dụng sao chép vị trí kho hàng
        </Typography>

        <Typography id="modal-hepper-description" sx={{ my: 2 }}>
          1. Mở Google Maps <br />
          2. Tìm địa chỉ cần sao chép vị trí kho hàng <br />
          3. Nhấp chuột phải vào vị trí cần sao chép <br />
          4. Chọn tùy chọn như hình chụp<br />
          5. Nhấn vào nút &quot;Dán vị trí từ bán đồ&quot;
        </Typography>

        <img src="/assets/images/hepper.png" alt="warehouse" />
     
      </Box>
    </Modal>
  );
}
ModalHelper.propTypes = {
  openModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
