import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { handleCreateExcel, handleImportExcel } from 'src/utils/excel';
import { Stack, styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import { IconSave, IconExcel, IconUpload, IconDelete } from '../iconify/icon';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  maxWidth: '90%',
  boxShadow: 24,
  p: 4,
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ImportExcelModal({
  validateKey,
  nameSheet = 'List',
  nameFile = 'data',
  columns,
  onSave,
  loading
}) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUploadFile = async (e) => {
    if (e.target.files.length === 0) return;
    const d = await handleImportExcel(e, validateKey);
    setData(d);
  };
  const handleSave = () => {
    const d = data.map(({ key, ...rest }) => rest); 
    onSave(d);
  };
  return (
    <div>
      <Button variant="contained" color="inherit" startIcon={<IconUpload />} onClick={handleOpen}>
        Nhập từ file
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-import-excel-title"
        aria-describedby="modal-import-excel-description"
      >
        <Box sx={style}>
          <Stack spacing={2} direction="row" alignItems="center" mb={2}>
            <Typography id="modal-import-excel-title" variant="h6" component="h2">
              Nhập từ file
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleCreateExcel(validateKey, nameSheet, nameFile)}
              color="inherit"
              startIcon={<IconExcel />}
            >
              Tạo file mẫu
            </Button>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              color="inherit"
              tabIndex={-1}
              startIcon={<IconUpload />}
            >
              Tải lên file
              <VisuallyHiddenInput type="file" onChange={handleUploadFile} accept=".xlsx, .xls" />
            </Button>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<IconSave />}
              disabled={data.length === 0}
              onClick={() => handleSave()}
            >
              Lưu
            </Button>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<IconDelete />}
              onClick={() => setData([])}
            >
              Xóa dữ liệu
            </Button>
          </Stack>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={data}
              columns={columns}
              loading={loading}
              slotProps={{
                loadingOverlay: {
                  variant: 'linear-progress',
                  noRowsVariant: 'linear-progress',
                },
              }}
              getRowId={(row) => row.key}
              localeText={{
                noRowsLabel: 'Không có dữ liệu',
                MuiTablePagination: {
                  labelRowsPerPage: 'Số dòng mỗi trang',
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
ImportExcelModal.propTypes = {
  validateKey: PropTypes.array.isRequired,
  nameSheet: PropTypes.string,
  nameFile: PropTypes.string,
  columns: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
