import { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'src/routes/hooks';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';
import LoadingFull from 'src/components/loading/loading-full';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableNoData from 'src/components/table/table-no-data';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';
import { Box, List, Modal, IconButton, ListItemText } from '@mui/material';
import { setStatus, deleteReceipt, fetchAllReceipts } from 'src/redux/slices/receiptSlices';
import { formatCurrency } from 'src/utils/format-number';
import { formatDateTime } from 'src/utils/format-time';
import { useReactToPrint } from 'react-to-print';
import ReceiptTableToolbar from '../table-toolbar';
import ReceiptTableHead from '../table-head';
import ReceiptTableRow from '../table-row';
import { allReceiptWarehouses } from 'src/redux/slices/receiptWarehouseSlices';

// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ReceiptWarehousePage() {
  const [page, setPage] = useState(0);

  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirm, setConfirm] = useState(false);
  const [open, setOpen] = useState(false);

  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const dispatch = useDispatch();
  const route = useRouter();

  const data = useSelector((state) => state.receipts.receipts);
  const status = useSelector((state) => state.receipts.status);
  const error = useSelector((state) => state.receipts.error);
  const statusDelete = useSelector((state) => state.receipts.statusDelete);

  const handleClose = () => setOpen(false);
  useEffect(() => {
    dispatch(allReceiptWarehouses());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'successful') {
      setReceipts(data);
    }
  }, [status, dispatch, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa hóa đơn thành công!');
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
      dispatch(fetchAllReceipts());
    }
    if (statusDelete === 'failed') {
      handleToast('error', error.messages);
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
    }
  }, [statusDelete, dispatch, error]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = receipts.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: receipts,
    comparator: getComparator(order, orderBy),
    filterName,
    fillerQuery: 'name',
  });
  const handleNavigate = (id) => {
    route.push(id);
  };
  const handleDelete = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    dispatch(deleteReceipt(confirm));
  };
  const handleSelectedReceipt = (id) => {
    setOpen(true);
    setSelectedReceipt(receipts.find((item) => item._id === id));
  };
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
        label="hóa đơn đã chọn"
        secondLabel="Việc xóa hóa đơn sẽ cập nhật lại sản phẩm, bạn có chắc chắn muốn xóa?"
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
          <Stack ref={contentRef} direction="column" justifyContent="space-between" spacing={2} sx={{
            padding: 2,
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Hóa đơn - {selectedReceipt && selectedReceipt.receiptCode}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Tên khách hàng:</Typography>
              <Typography variant="body2">{selectedReceipt && selectedReceipt.name}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Tổng tiền:</Typography>
              <Typography variant="body2">
                {selectedReceipt && formatCurrency(selectedReceipt.total)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Kiểu thanh toán:</Typography>
              <Typography variant="body2">
                {selectedReceipt && selectedReceipt.paymentMethod}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Kiểu mua:</Typography>
              <Typography variant="body2">{selectedReceipt && selectedReceipt.type}</Typography>
            </Stack>
            <Stack direction="column" spacing={2}>
              <Typography variant="body1">Danh sách sản phẩm:</Typography>
              <List
                sx={{
                  mt: 0,
                }}
              >
                {selectedReceipt &&
                  selectedReceipt.productsList.map((item, i) => (
                    <ListItemText
                      key={i}
                      primary={`${item.name} - ${item.variantColor} - ${item.variantSize}`}
                      secondary={`${item.quantity} - ${formatCurrency(item.price)}`}
                    />
                  ))}
              </List>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Ngày tạo:</Typography>
              <Typography variant="body2">
                {selectedReceipt && formatDateTime(selectedReceipt.createdAt)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Ngày cập nhật:</Typography>
              <Typography variant="body2">
                {selectedReceipt && formatDateTime(selectedReceipt.updatedAt)}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={handleClose}>
              Đóng
            </Button>
            <Button variant="contained" color='inherit' onClick={reactToPrintFn}>
              In hóa đơn
            </Button>
            <Button
              variant="contained"
              color='inherit'
              onClick={() => handleToast('info', 'Tính năng đang phát triển!')}
            >
              Chỉnh sửa
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Hóa đơn</Typography>

          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAllReceipts())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
        <Button
          variant="contained"
          onClick={() => route.push('/pos')}
          color="inherit"
          startIcon={<Iconify icon="hugeicons:sale-tag-01" />}
        >
          Bán hàng
        </Button>
      </Stack>

      <Card>
        <ReceiptTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ReceiptTableHead
                order={order}
                orderBy={orderBy}
                rowCount={receipts.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Tên khách hàng' },
                  { id: 'receiptCode', label: 'Mã hóa đơn' },
                  { id: 'quantity', label: 'Số sản phẩm' },
                  { id: 'paymentMethod', label: 'Kiểu thanh toán' },
                  { id: 'total', label: 'Tổng tiền' },
                  { id: 'createdAt', label: 'Ngày tạo' },
                  { id: 'updatedAt', label: 'Ngày cập nhật' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ReceiptTableRow
                      key={row._id}
                      name={row.name}
                      total={row.total}
                      createdAt={row.createdAt}
                      receiptCode={row.receiptCode}
                      updatedAt={row.updatedAt}
                      quantity={row.productsList.length}
                      paymentMethod={row.paymentMethod}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClickRow={(event) => handleSelectedReceipt(row._id)}
                      handleClick={(event) => handleClick(event, row._id)}
                      handleNavigate={() => handleNavigate(row._id)}
                      onDelete={() => handleDelete(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, receipts.length)}
                  col={8}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          labelRowsPerPage="Số hàng trên trang"
          count={receipts.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
