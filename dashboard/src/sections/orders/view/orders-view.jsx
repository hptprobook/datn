import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { fetchAll } from 'src/redux/slices/orderSlices';
import { applyFilter, getComparator } from 'src/components/table/utils';
import TableNoData from 'src/components/table/table-no-data';
import LoadingFull from 'src/components/loading/loading-full';
import { Button, IconButton } from '@mui/material';
import { IconRefresh } from 'src/components/iconify/icon';
import { useNavigate } from 'react-router-dom';
import OrderTableRow from '../order-table-row';
import OrderTableHead from '../order-table-head';
import OrderTableToolbar from '../order-table-toolbar';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataOrder = useSelector((state) => state.orders.orders);
  const status = useSelector((state) => state.orders.status);

  const [data, setData] = useState([]);
  const getOrders = ({ p = 1, limit = rowsPerPage }) => {
    dispatch(
      fetchAll({
        page: p,
        limit,
      })
    );
  };
  useEffect(() => {
    getOrders({ p: 1, limit: 5 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'successful') {
      setData(dataOrder.result);
    }
  }, [status, dataOrder]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
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
    getOrders({
      p: newPage + 1,
      limit: rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    getOrders({
      p: 1,
      limit: parseInt(event.target.value, 10),
    });
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
    fillerQuery: 'orderCode',
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Đơn hàng</Typography>
          <IconButton onClick={() => getOrders({ p: 1, limit: rowsPerPage })}>
            <IconRefresh />
          </IconButton>
        </Stack>
        <Button variant="contained" color="inherit" onClick={() => navigate('create')}>
          Tạo đơn hàng
        </Button>
      </Stack>

      {status === 'loading' && <LoadingFull />}
      <Card>
        <OrderTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                // onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'orderCode', label: 'Mã đơn hàng' },
                  { id: 'name', label: 'Tên khách hàng' },
                  { id: 'userId', label: 'Mã khách hàng' },
                  { id: 'paymentMethod', label: 'Phương thức thanh toán' },
                  { id: 'totalAmount', label: 'Tổng tiền' },
                  { id: 'status', label: 'Trạng thái' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <OrderTableRow
                    key={row._id}
                    name={row.shippingInfo.name}
                    userId={row.userId}
                    status={row.status}
                    orderCode={row.orderCode}
                    id={row._id}
                    paymentMethod={row.paymentMethod}
                    avatarUrl={row.avatarUrl}
                    totalAmount={row.totalPrice}
                    selected={selected.indexOf(row._id) !== -1}
                    handleClick={(event) => handleClick(event, row._id)}
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
          count={dataOrder.count || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
