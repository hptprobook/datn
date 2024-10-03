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

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';

import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, resetDelete , deleteCoupon } from 'src/redux/slices/couponSlice';
import { useRouter } from 'src/routes/hooks';
import TableNoData from '../coupon-no-data';
import CouponTableRow from '../coupon-table-row';
import CouponTableHead from '../coupon-table-head';
import TableEmptyRows from '../coupon-empty-rows';
import CouponTableToolbar from '../coupon-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

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
  
  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'successful') {
      setCoupons(data);
    }
  }, [status, dispatch, data]);


  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa Mã giảm giá thành công');
      dispatch(resetDelete());
    }
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
      const newSelected = coupons.map((n) => n.name);
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
    console.log(newSelected);
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
  const notFound = !dataFiltered.length && !!filterName;


  

  const [confirm, setConfirm] = useState(false);
  const [confirmMulti, setConfirmMulti] = useState(false);
  return (
    <Container>
       {status === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />
      {/* <ConfirmDelete
        openConfirm={!!confirmMulti}
        onAgree={handleMultiDelete}
        onClose={() => setConfirmMulti(false)}
        label="những mã giảm giá đã chọn"
      /> */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Mã giảm giá</Typography>

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
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CouponTableRow
                    id={row._id}
                      key={row._id}
                      code={row.code}
                      type={row.type}
                      applicableProducts={row.applicableProducts}
                      usageLimit={row.usageLimit}
                      minPurchasePrice={row.minPurchasePrice}
                      maxPurchasePrice={row.maxPurchasePrice}
                      usageCount={row.usageCount}
                      status={row.status}
                      limitOnUser={row.limitOnUser} // Make sure to include limitOnUser if you want to display it
                      dateStart={row.dateStart}
                      dateEnd={row.dateEnd}
                      selected={selected.indexOf(row.code) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      onDelete={handleDelete}
                      handleNavigate={() => handleNavigate(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, coupons.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={coupons.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
