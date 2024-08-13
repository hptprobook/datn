import React, { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { users } from 'src/_mock/user';
import { useNavigate } from 'react-router-dom';
import {fetchAllProducts } from 'src/redux/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { handleToast } from 'src/hooks/toast';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import ProductTableRow from '../product-table-row';
import ProductTableHead from '../product-table-head';
import TableEmptyRows from '../table-empty-rows';
import ProductTableToolbar from '../product-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //product
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const statusPro = useSelector((state) => state.products.status);
  const [productsList, setProductsList] = React.useState([]);
  // const errorPro = useSelector((state) => state.products.error);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  
  useEffect(() => {
    if (statusPro === 'succeeded') {
      setProductsList(products);
    }
  }, [products, statusPro]);

  useEffect(() => {
    if (statusPro === 'failed') {
      handleToast('error', 'Failed to fetch products');
    } else if (statusPro === 'succeeded') {
      setProductsList(products);
    }
  }, [products, statusPro]);

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
  });

  const notFound = !dataFiltered.length && !!filterName;
  //to new product
  const navigate = useNavigate();

  const handleNewProductClick = () => {
    navigate('/products/create');
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Sản phẩm</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleNewProductClick}
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
                  { id: 'price', label: 'Giá' },
                  { id: 'brand', label: 'Thương hiệu' },
                  { id: 'stock', label: 'Stock' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ProductTableRow
                    key={row._id}
                    _id={row._id}
                    name={row.name}
                    imgURLs={row.imgURLs}
                    price={row.price}
                    brand={row.brand}
                    stock={row.stock}
                    selected={selected.indexOf(row.name) !== -1}
                    handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
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
