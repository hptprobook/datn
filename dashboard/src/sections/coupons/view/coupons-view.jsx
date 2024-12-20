import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';
import { handleExport } from 'src/utils/excel';
import { IconExcel } from 'src/components/iconify/icon';
import ImportExcelModal from 'src/components/modal/import-modal';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAll,
  setStatus,
  resetDelete,
  deleteCoupon,
  deleteManyCoupon,
  createManyCoupon
} from 'src/redux/slices/couponSlice';
import { useRouter } from 'src/routes/hooks';
import { formatCurrency } from 'src/utils/format-number';
import TableNoData from 'src/components/table/table-no-data';
import CouponTableRow from '../coupon-table-row';

import CouponTableToolbar from '../coupon-table-toolbar';
import { applyFilter, getComparator } from '../utils';
import CouponTableHead from '../coupon-table-head';

// ----------------------------------------------------------------------
const columns = [
  { field: '_id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Tên', width: 150 },
  { field: 'code', headerName: 'Mã', width: 150 },
  { field: 'type', headerName: 'Loại', width: 150 },
  { field: 'minPurchasePrice', headerName: 'Giá mua tối thiểu', width: 150 },
  { field: 'maxPurchasePrice', headerName: 'Giá mua tối đa', width: 150 },
  { field: 'usageLimit', headerName: 'Giới hạn sử dụng', width: 150 },
  { field: 'usageCount', headerName: 'Số lần sử dụng', width: 150 },
  { field: 'status', headerName: 'Trạng thái', width: 150 },
  { field: 'limitOnUser', headerName: 'Giới hạn người dùng', width: 150 },
  { field: 'dateStart', headerName: 'Ngày bắt đầu', width: 150 },
  { field: 'dateEnd', headerName: 'Ngày kết thúc', width: 150 },
];
export default function CouponsPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [coupons, setCoupons] = useState([]);

  const dispatch = useDispatch();
  const route = useRouter();

  const data = useSelector((state) => state.coupons.coupons);
  const status = useSelector((state) => state.coupons.status);
  const statusDelete = useSelector((state) => state.coupons.statusDelete);
  const statusCreate = useSelector((state) => state.coupons.statusCreate);
  const dataCreateMany = useSelector((state) => state.coupons.dataCreateMany);

  const getCoupons = (p = 1, limit = 2) =>
    dispatch(
      fetchAll({
        page: p,
        limit,
      })
    );
  useEffect(() => {
    getCoupons(1, rowsPerPage);
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (status === 'successful') {
      setCoupons(data.data);
    }
  }, [status, dispatch, data]);

  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa Mã giảm giá thành công');
      getCoupons(page + 1, rowsPerPage);
      dispatch(resetDelete());
    }
    // eslint-disable-next-line
  }, [statusDelete, dispatch]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = coupons.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    getCoupons(newPage + 1, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    getCoupons(1, event.target.value);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: coupons,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const handleNavigate = (id) => {
    route.push(id);
  };
  const handleDelete = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    dispatch(deleteCoupon(confirm));
  };
  const handleMultiDelete = () => {
    setSelected([]);
    dispatch(deleteManyCoupon(selected));
  };
  const handleSave = (d) => {
    // Filter out invalid entries
    const validData = d.filter(item => item._id !== null && item.name && item.code && item.type && item.dateStart && item.dateEnd);
  
    if (validData.length === 0) {
      handleToast('error', 'Dữ liệu không hợp lệ.');
      return;
    }
  
    dispatch(
      createManyCoupon({
        data: validData,
      })
    );
  };
  useEffect(() => {
    if (statusCreate === 'successful') {
      if (dataCreateMany?.successful) {
        dataCreateMany.successful.forEach((item) => {
          if (item?.message) {
            handleToast('success', item.message);
          }
        });
      }
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
    if (statusCreate === 'failed') {
      handleToast('error', dataCreateMany?.message || 'Thêm mã giảm giá thất bại');
      if (dataCreateMany?.errors) {
        dataCreateMany.errors.forEach((item) => {
          if (item?.message) {
            handleToast('error', `${item.name}: ${item.message}`);
          }
        });
      }
      if (dataCreateMany?.successful) {
        dataCreateMany.successful.forEach((item) => {
          if (item?.message) {
            handleToast('success', item.message);
          }
        });
      }
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
  }, [statusCreate, dataCreateMany, dispatch]);
  const notFound = !dataFiltered.length && !!filterName;

  const [confirm, setConfirm] = useState(false);
  const [confirmMulti, setConfirmMulti] = useState(false);
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusDelete === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />
      <ConfirmDelete
        openConfirm={!!confirmMulti}
        onAgree={handleMultiDelete}
        onClose={() => setConfirmMulti(false)}
        label="những mã giảm giá đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Mã giảm giá </Typography>
          <Button
            variant="contained"
            onClick={() => handleExport(coupons, 'Danh sách Mã Giảm giá', 'coupons')}
            color="inherit"
            startIcon={<IconExcel />}
          >
            Xuất Excel
          </Button>
          <ImportExcelModal
            validateKey={[
              '_id',
              'name',
              'code',
              'type',
              'minPurchasePrice',
              'maxPurchasePrice',
              'discountValue',
              'description',
              'usageLimit',
              'discountPercent',
              'status',
              'dateStart',
              'dateEnd',
              'limitOnUser',
              'usageCount',
              ]}
            columns={columns}
            onSave={handleSave}
            loading={statusCreate === 'loading'}
          />
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => getCoupons(1, rowsPerPage)}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>

        <Button
          variant="contained"
          onClick={() => route.push('create')}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Tạo mã giảm giá
        </Button>
      </Stack>

      <Card>
        <CouponTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onMultiDelete={() => setConfirmMulti(true)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CouponTableHead
                order={order}
                orderBy={orderBy}
                rowCount={coupons.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'code', label: 'Mã' },
                  { id: 'type', label: 'Loại' },
                  { id: 'minPurchasePrice', label: 'Giá mua tối thiểu' },
                  { id: 'maxPurchasePrice', label: 'Giá mua tối đa' },
                  { id: 'usageLimit', label: 'Giới hạn sử dụng' },
                  { id: 'usageCount', label: 'Số lần sử dụng' },
                  { id: 'status', label: 'Trạng thái' },
                  { id: 'limitOnUser', label: 'Giới hạn người dùng' },
                  { id: 'dateStart', label: 'Ngày bắt đầu' },
                  { id: 'dateEnd', label: 'Ngày kết thúc' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <CouponTableRow
                    id={row._id}
                    key={row._id}
                    code={row.code}
                    type={row.type}
                    applicableProducts={row.applicableProducts}
                    usageLimit={row.usageLimit}
                    minPurchasePrice={formatCurrency(row.minPurchasePrice)}
                    maxPurchasePrice={formatCurrency(row.maxPurchasePrice)}
                    usageCount={row.usageCount}
                    status={row.status}
                    limitOnUser={row.limitOnUser}
                    dateStart={row.dateStart}
                    dateEnd={row.dateEnd}
                    selected={selected.indexOf(row._id) !== -1}
                    handleClick={(event) => handleClick(event, row._id)}
                    onDelete={handleDelete}
                    handleNavigate={() => handleNavigate(row._id)}
                  />
                ))}
                {notFound && <TableNoData query={filterName} col={12} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={data.count}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
