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

import { useNavigate } from 'react-router-dom';
import {
  setStatus,
  fetchAllProducts,
  fetchProductById,
  deleteProductById,
} from 'src/redux/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { handleToast } from 'src/hooks/toast';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableNoData from 'src/components/table/table-no-data';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import LoadingFull from 'src/components/loading/loading-full';
import { Drawer, IconButton } from '@mui/material';
import { fetchAll } from 'src/redux/slices/brandSlices';
import ProductTableRow from '../product-table-row';
import ProductTableHead from '../product-table-head';
import ProductTableToolbar from '../product-table-toolbar';
import ProductCard from '../product-card';
import { renderBrand } from '../utils';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const product = useSelector((state) => state.products.product);
  const brands = useSelector((state) => state.brands.brands);
  const statusGet = useSelector((state) => state.products.statusGet);
  const statusDelete = useSelector((state) => state.products.statusDelete);
  const error = useSelector((state) => state.products.error);
  const [productsList, setProductsList] = React.useState([]);

  // const errorPro = useSelector((state) => state.products.error);

  const toggleDrawer = (value) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    if (value) {
      console.log(value);
      dispatch(fetchProductById({ id: value }));
    } else {
      dispatch(setStatus({ key: 'statusGet', value: '' }));
      dispatch(setStatus({ key: 'product', value: null }));
    }
    setOpen(!open);
  };
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa sản phẩm thành công!');
      dispatch(fetchAllProducts());
    }
    if (statusDelete === 'failed') {
      handleToast('error', error?.message || 'Có lỗi xảy ra vui lòng thử lại!');
    }
    dispatch(setStatus({ key: 'statusDelete', value: '' }));
  }, [statusDelete, dispatch, error]);

  useEffect(() => {
    if (status === 'failed') {
      handleToast('error', 'Có lỗi xảy ra vui lòng thử lại!');
    } else if (status === 'successful') {
      setProductsList(products);
      dispatch(fetchAll());
    }
  }, [products, status, dispatch]);

  // console.log(productsList);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productsList.map((n) => n.name);
      setSelected(newSelecteds);
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
    inputData: productsList,
    comparator: getComparator(order, orderBy),
    filterName,
    fillerQuery: 'name',
  });

  const notFound = !dataFiltered.length && !!filterName;
  const navigate = useNavigate();

  const [confirm, setConfirm] = useState(false);
  const dispatchDelete = () => {
    dispatch(deleteProductById({ id: confirm }));
  };
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusDelete === 'loading' && <LoadingFull />}
      <Drawer anchor="right" open={open} onClose={toggleDrawer()}>
        <ProductCard
          product={product}
          status={statusGet}
          brand={renderBrand(product?._id, brands)}
        />
      </Drawer>
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
        label="sản phẩm đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Sản phẩm</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAllProducts())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => navigate('create')}
        >
          Tạo sản phẩm
        </Button>
      </Stack>

      <Card>
        <ProductTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProductTableHead
                order={order}
                orderBy={orderBy}
                rowCount={productsList.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Tên' },
                  { id: 'slug', label: 'Slug' },
                  { id: 'price', label: 'Giá' },
                  { id: 'brand', label: 'Thương hiệu' },
                  { id: 'averageRating', label: 'Đánh giá' },
                  { id: 'statusStock', label: 'Trạng thái' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ProductTableRow
                      onClick={toggleDrawer(row._id)}
                      key={row._id}
                      _id={row._id}
                      name={row.name}
                      imgURLs={row.thumbnail}
                      price={row.price}
                      brand={renderBrand(row.brand, brands)}
                      slug={row.slug}
                      averageRating={row.averageRating}
                      statusStock={row.statusStock}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      onDelete={() => setConfirm(row._id)}
                      handleNavigate={() => navigate(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  col={5}
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, productsList.length)}
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
          count={productsList.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
