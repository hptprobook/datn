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
import TableNoData from 'src/components/table/table-no-data';
import { applyFilter, getComparator } from 'src/components/table/utils';
import { Box, List, Modal, IconButton, ListItemText } from '@mui/material';
import { formatCurrency } from 'src/utils/format-number';
import { formatDateTime } from 'src/utils/format-time';
import { useReactToPrint } from 'react-to-print';
import {
  setStatus,
  allReceiptWarehouses,
  deleteReceiptWarehouse,
} from 'src/redux/slices/receiptWarehouseSlices';
import { fetchAll as fetchWarehouses } from 'src/redux/slices/warehouseSlices';
import { fetchAll as fetchSupplier } from 'src/redux/slices/supplierSlices';
import ReceiptTableToolbar from '../table-toolbar';
import ReceiptTableHead from '../table-head';
import ReceiptTableRow from '../table-row';

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

  const data = useSelector((state) => state.receiptsWarehouse.receiptsWarehouse);
  const status = useSelector((state) => state.receiptsWarehouse.status);
  const error = useSelector((state) => state.receiptsWarehouse.error);
  const statusDelete = useSelector((state) => state.receiptsWarehouse.statusDelete);
  const suppliers = useSelector((state) => state.suppliers.suppliers);
  const warehouses = useSelector((state) => state.warehouses.warehouses);

  const handleClose = () => setOpen(false);
  const getRecipes = (p, r) => dispatch(allReceiptWarehouses({
    page: p,
    limit: r,
  }));
  useEffect(() => {
    getRecipes(page, rowsPerPage);
    dispatch(fetchSupplier());
    dispatch(fetchWarehouses());
    // eslint-disable-next-line
  }, [dispatch]);
  useEffect(() => {
    if (status === 'successful') {
      setReceipts(data.result);
    }
  }, [status, dispatch, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa hóa đơn thành công!');
      setConfirm(false);
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
      getRecipes(page, rowsPerPage);
    }
    if (statusDelete === 'failed') {
      if (error && error.messages) {
        handleToast('error', error.messages);
      } else if (error && error.errors) {
        error.errors.forEach((e) => {
          handleToast('error', `${e.sku}: ${e.errors}`);
        });
      }
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
    }
    // eslint-disable-next-line
  }, [statusDelete, error]);

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
    getRecipes(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    getRecipes(0, parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: receipts,
    comparator: getComparator(order, orderBy),
    filterName,
    fillerQuery: 'code',
  });
  const handleNavigate = (id) => {
    route.push(id);
  };

  const handleDelete = (t) => {
    setConfirm(false);
    if (t) {
      dispatch(deleteReceiptWarehouse({ id: confirm, updateAfter: true }));
    } else
      dispatch(
        deleteReceiptWarehouse({
          id: confirm,
          updateAfter: false,
        })
      );
  };
  const handleSelectedReceipt = (id) => {
    setOpen(true);
    setSelectedReceipt(receipts.find((item) => item._id === id));
  };
  const notFound = !dataFiltered.length && !!filterName;
  const renderName = (id, d, n) => {
    const item = d.find((i) => i._id === id);
    if (n) {
      return item && item[n] ? item[n] : 'Không xác định';
    }
    return item && item.name ? item.name : 'Không xác định';
  };
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={() => handleDelete(true)}
        onClose={() => setConfirm(false)}
        label="hóa đơn đã chọn"
        secondLabel="Việc xóa hóa đơn sẽ cập nhật lại sản phẩm, bạn có chắc chắn muốn xóa?"
        secondAgree="Xóa mà không cập nhật lại hóa đơn"
        onSecondAgree={() => handleDelete(false)}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            ref={contentRef}
            direction="column"
            justifyContent="space-between"
            spacing={2}
            sx={{
              padding: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Hóa đơn - {selectedReceipt && selectedReceipt.code}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Kho:</Typography>
              <Typography variant="body2">
                {selectedReceipt && renderName(selectedReceipt.warehouseId, warehouses)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Nhà cung cấp:</Typography>
              <Typography variant="body2">
                {selectedReceipt &&
                  renderName(selectedReceipt.supplierId, suppliers, 'companyName')}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Tổng tiền:</Typography>
              <Typography variant="body2">
                {selectedReceipt && formatCurrency(selectedReceipt.totalPrice)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Kiểu thanh toán:</Typography>
              <Typography variant="body2">
                {selectedReceipt && selectedReceipt.paymentMethod}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Trạng thái:</Typography>
              <Typography variant="body2">
                {selectedReceipt && selectedReceipt.statusPayment}
              </Typography>
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
                      sx={{
                        borderBottom: '1px solid #f0f0f0',
                      }}
                      primary={`${item.name} - ${item.sku} - ${item.size}`}
                      secondary={`${item.quantity} x ${formatCurrency(item.price)} - Giảm giá: ${formatCurrency(item.discount)} `}
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
            <Button variant="contained" color="inherit" onClick={reactToPrintFn}>
              In hóa đơn
            </Button>
            {/* <Button
              variant="contained"
              color="inherit"
              onClick={() => handleToast('info', 'Tính năng đang phát triển!')}
            >
              Chỉnh sửa
            </Button> */}
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
            onClick={() => getRecipes(page, rowsPerPage)}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
        <Button
          variant="contained"
          onClick={() => route.push('create')}
          color="inherit"
          startIcon={<Iconify icon="lsicon:warehouse-into-filled" />}
        >
          Nhập kho
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
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'warehouse', label: 'Kho' },
                  { id: 'supplier', label: 'Nhà cung cấp' },
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
                  .map((row) => (
                    <ReceiptTableRow
                      key={row._id}
                      warehouse={renderName(row.warehouseId, warehouses)}
                      supplier={renderName(row.supplierId, suppliers, 'companyName')}
                      total={row.totalPrice}
                      createdAt={row.createdAt}
                      receiptCode={row.code}
                      updatedAt={row.updatedAt}
                      quantity={row.productsList.length}
                      paymentMethod={row.paymentMethod}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClickRow={(event) => handleSelectedReceipt(row._id)}
                      handleClick={(event) => handleClick(event, row._id)}
                      handleNavigate={() => handleNavigate(row._id)}
                      onDelete={() => setConfirm(row._id)}
                    />
                  ))}


                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          labelRowsPerPage="Số hàng trên trang"
          count={data.count || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
