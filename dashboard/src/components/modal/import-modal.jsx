import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { handleCreateExcel, handleImportExcel } from 'src/utils/excel';
import { Stack, styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconExcel, IconUpload } from '../iconify/icon';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
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
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

export default function ImportExcelModal({
                                           validateKey,
    nameSheet,
    nameFile

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
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography id="modal-import-excel-title" variant="h6" component="h2">
              Nhập từ file
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleCreateExcel(validateKey, 'Danh sách biến thể', 'variants')}
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
              startIcon={<IconExcel />}
            >
              Tải lên file
              <VisuallyHiddenInput type="file" onChange={handleUploadFile} accept=".xlsx, .xls" />
            </Button>
          </Stack>
          <Typography id="modal-import-excel-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
