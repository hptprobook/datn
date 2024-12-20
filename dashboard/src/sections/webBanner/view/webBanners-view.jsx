import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Drawer, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAll,
  setStatus,
  fetchById,
  deleteWebBanner,
  createManyBanner,
} from 'src/redux/slices/webBannerSlice';
import { useRouter } from 'src/routes/hooks';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableNoData from 'src/components/table/table-no-data';
import { IconExcel } from 'src/components/iconify/icon';
import { handleExport } from 'src/utils/excel';
import ImportExcelModal from 'src/components/modal/import-modal';
import WebBannerTableRow from '../webBanner-table-row';

import WebBannerTableToolbar from '../webBanner-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import WebBannerTableHead from '../webBanner-table-head';
import WebBannerCard from '../webBanner-card';

// ----------------------------------------------------------------------
const columns = [
  { field: '_id', headerName: 'ID', width: 90 },
  {
    field: 'title',
    headerName: 'Tiêu đề',
    width: 150,
    editable: true,
  },
  {
    field: 'url',
    headerName: 'Đường dẫn',
    width: 150,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Mô tả',
    width: 110,
    editable: true,
  },
  {
    field: 'image',
    headerName: 'Hình ảnh',
    // sortable: false,
    width: 160,
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];
export default function WebBannersPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [webBanners, setWebBanners] = React.useState([]);

  const dispatch = useDispatch();
  const route = useRouter();

  const [open, setOpen] = React.useState(false);

  const data = useSelector((state) => state.webBanners.webBanners);
  const status = useSelector((state) => state.webBanners.status);
  const statusCreate = useSelector((state) => state.webBanners.statusCreate);
  const dataCreateMany = useSelector((state) => state.webBanners.dataCreateMany);
  const statusDelete = useSelector((state) => state.webBanners.statusDelete);
  const error = useSelector((state) => state.webBanners.error);
  const webBanner = useSelector((state) => state.webBanners.webBanner);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const toggleDrawer = (value) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    if (value) {
      dispatch(fetchById({ id: value }));
    } else {
      dispatch(setStatus({ key: 'webBanner', value: null }));
    }
    setOpen(!open);
  };
  useEffect(() => {
    if (status === 'successful') {
      setWebBanners(data);
    }
  }, [status, dispatch, data]);

  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa WebBanner thành công!');
      dispatch(fetchAll());
    }
    if (statusDelete === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra vui lòng thử lại!');
    }
    dispatch(setStatus({ key: 'statusDelete', value: '' }));
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
      const newSelected = webBanners.map((n) => n._id);
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
    inputData: webBanners,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleNavigate = (id) => {
    route.push(id);
  };
  const handleDelete = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    dispatch(deleteWebBanner(confirm));
  };
  const handleMultiDelete = () => {
    setSelected([]);
    // dispatch(deleteManyCoupon(selected));
  };
  const handleSave = (d) => {
      // Filter out invalid entries
      const validData = d.filter(item => item._id !== null && item.title && item.url && item.description && item.image);
  
      if (validData.length === 0) {
        handleToast('error', 'Dữ liệu không hợp lệ.');
        return;
      }
    dispatch(
      createManyBanner({
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
      handleToast('error', dataCreateMany?.message || 'Thêm banner thất bại');
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
        label="những Banner quảng cáo đã chọn"
      />
      <Drawer anchor="right" open={open} onClose={toggleDrawer()}>
        <WebBannerCard webBanner={webBanner} status={status} />
      </Drawer>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Banner quảng cáo </Typography>
          <Button
            variant="contained"
            onClick={() => handleExport(webBanners, 'Danh sách banner', 'webBanners')}
            color="inherit"
            startIcon={<IconExcel />}
          >
            Xuất Excel
          </Button>
          <ImportExcelModal
            validateKey={['title', 'url', 'image', 'description', '_id']}
            columns={columns}
            onSave={handleSave}
            loading={statusCreate === 'loading'}
          />

          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAll())}
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
          Tạo Banner quảng cáo
        </Button>
      </Stack>

      <Card>
        <WebBannerTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onMultiDelete={() => setConfirmMulti(true)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <WebBannerTableHead
                order={order}
                orderBy={orderBy}
                rowCount={webBanners.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'title', label: 'Tiêu đề' },
                  { id: 'description', label: 'Mô tả' },
                  { id: 'url', label: 'Đường dẫn' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <WebBannerTableRow
                      onClick={toggleDrawer(row._id)}
                      id={row._id}
                      key={row._id}
                      image={row.image}
                      title={row.title}
                      description={row.description}
                      url={row.url}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      onDelete={handleDelete}
                      handleNavigate={() => handleNavigate(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, webBanners.length)}
                  col={12}
                />

                {notFound && <TableNoData query={filterName} col={12} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={webBanners.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Số dòng trên trang"
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
