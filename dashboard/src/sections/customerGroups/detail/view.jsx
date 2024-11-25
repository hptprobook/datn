/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Card,
  Radio,
  Table,
  Button,
  Select,
  MenuItem,
  TextField,
  FormLabel,
  TableBody,
  RadioGroup,
  IconButton,
  FormControl,
  FormHelperText,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
import { Form, Formik, FieldArray } from 'formik';
import './styles.css';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Iconify from 'src/components/iconify/iconify';
import { handleToast } from 'src/hooks/toast';
import {
  setStatus,
  addCustomerToGroup,
  getOneCustomerGroup,
  updateCustomerGroup,
  removeCustomerFromGroup
} from 'src/redux/slices/customerGroupSlice';
import LoadingFull from 'src/components/loading/loading-full';
// import { AutoSelect } from '../auto-select';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
import { isValidObjectId } from 'src/utils/check';
import Scrollbar from 'src/components/scrollbar';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import {
  emptyRows,
  applyFilter,
  getComparator,
  FIELD_OPTIONS,
  customerGroupSchema,
  QUERY_OPTIONS_TRANG_THAI,
  QUERY_OPTIONS_TONG_DON_HANG
} from '../utils';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import CustomerTableRow from '../customer-table-row';
import CustomerTableHead from '../customer-table-head';
import CustomerTableToolbar from '../customer-table-toolbar';

// ----------------------------------------------------------------------

export default function DetailCustomerGroupPage() {
  const { id } = useParams();
  const route = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(getOneCustomerGroup({ id }));
      } else {
        handleToast('error', 'Id không hợp lệ');
        route.push('/blogs');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const status = useSelector((state) => state.customerGroups.statusUpdate);
  const error = useSelector((state) => state.customerGroups.error);
  const customerGroup = useSelector((state) => state.customerGroups.customerGroup);
  const [manual, setManual] = useState(customerGroup.manual);
  const [customer, setCustomer] = useState([]);
  const statusAddCustomer = useSelector((state) => state.customerGroups.statusAdd);
  const statusRemoveCustomer = useSelector((state) => state.customerGroups.statusRemove);

  const initialValues = {
    name: customerGroup.name || '',
    note: customerGroup.note || '',
    manual: customerGroup.manual || manual,
    satisfy: customerGroup.satisfy || 'all',
    ...(manual === false && {
      auto: customerGroup.auto || [
        {
          field: '',
          query: '',
          status: '',
        }
      ],
    }),
    listCustomer: customerGroup.listCustomer || [],
  };

  useEffect(() => {
    if (statusAddCustomer === 'successful') {
      handleToast('success', 'Thêm khách hàng vào nhóm thành công');
      dispatch(setStatus({ key: 'statusAdd', value: 'idle' }));
    }
    if (statusAddCustomer === 'failed') {
      handleToast('error', error.message);
    }
    if (statusRemoveCustomer === 'successful') {
      handleToast('success', 'Xóa khách hàng khỏi nhóm thành công');
      dispatch(setStatus({ key: 'statusRemove', value: 'idle' }));
    }
    if (statusRemoveCustomer === 'failed') {
      handleToast('error', error.message);
    }
  })

  useEffect(() => {
    if (customerGroup && customerGroup.manual !== undefined) {
      setManual(customerGroup.manual);
    }
    if (status === 'failed') {
      console.log('error', error);
      handleToast('error', error.message);
    }
    if (status === 'successful') {
      handleToast('success', 'Cập nhật nhóm khách hàng thành công');
    }
    dispatch(setStatus({ key: 'statusUpdate', value: 'idle' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerGroup, status, error, dispatch]);

  const handleSort = (event, sortId) => {
    const isAsc = orderBy === sortId && order === 'asc';
    if (sortId !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(sortId);
    }
  };

  const handleClick = (event, clickId) => {
    const selectedIndex = selected.indexOf(clickId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, clickId);
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
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = (customerGroup?.listCustomer || []).map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleDelete = (delID) => {
    setConfirm(delID);
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
  const handleAddCustomerGroup = (customeData) => {
    setCustomer([...customer, customeData]);
    dispatch(addCustomerToGroup({ id, data: customeData }));
  };

  const dispatchDelete = () => {
    const delCutomerGroupId = id;
    dispatch(removeCustomerFromGroup({ id: delCutomerGroupId, userId: confirm }));
  };
  const dataFiltered = applyFilter({
    inputData: customerGroup.listCustomer,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const [confirm, setConfirm] = useState(false);

  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusAddCustomer === 'loading' && <LoadingFull />}
      {statusRemoveCustomer === 'loading' && <LoadingFull />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Cập nhật nhóm khách hàng</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(getOneCustomerGroup({ id }))}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
      </Stack>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={customerGroupSchema}
        onSubmit={(values) => {
          if (values.manual === false) {
            if (!values.auto || values.auto.length === 0) {
              handleToast('error', 'Vui lòng chọn ít nhất một điều kiện');
              return;
            }
            const hasAutoError = values.auto.some((auto) => {
              if (!auto.field) {
                handleToast('error', 'Trường là bắt buộc');
                return true;
              }
              if (!auto.query) {
                handleToast('error', 'Điều kiện là bắt buộc');
                return true;
              }
              if (!auto.status) {
                handleToast('error', 'Giá trị là bắt buộc');
                return true;
              }
              return false;
            });

            if (hasAutoError) {
              return;
            }
          }

          if (values.manual === true) {
            if (values.listCustomer && values.listCustomer.length > 0) {
              const hasError = values.listCustomer.some((customerCheck) => {
                if (!customerCheck.name) {
                  handleToast('error', 'Tên khách hàng là bắt buộc');
                  return true;
                }
                if (!customerCheck.email) {
                  handleToast('error', 'Email khách hàng là bắt buộc');
                  return true;
                }
                if (!customerCheck.phone) {
                  handleToast('error', 'Số điện thoại khách hàng là bắt buộc');
                  return true;
                }
                return false;
              });

              if (hasError) {
                return;
              }
            } else {
              handleToast('error', 'Vui lòng thêm ít nhất một khách hàng');
              return;
            }
          }


          if (values.manual) {
            delete values.auto;
          }
          console.log(values);
          dispatch(updateCustomerGroup({ id, data: values }));
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              <Grid2 xs={8}>
                <Stack spacing={3}>
                  <Card sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Thông tin cơ bản
                    </Typography>
                    <Grid2 container spacing={3}>
                      <Grid2 xs={12}>
                        <TextField
                          fullWidth
                          label="Tên nhóm khách hàng"
                          variant="outlined"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          rows={2} // Adjust the number of rows as needed
                          multiline
                        />
                      </Grid2>
                    </Grid2>
                  </Card>
                </Stack>
              </Grid2>
              <Grid2 xs={4}>
                <Card sx={{ padding: 3 }}>
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Ghi chú
                    </Typography>
                    <TextField
                      fullWidth
                      label="Ghi chú"
                      variant="outlined"
                      name="note"
                      placeholder='VD: Nhóm khách hàng mua hàng thường xuyên'
                      value={values.note}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.note && Boolean(errors.note)}
                      helperText={touched.note && errors.note}
                      rows={2} // Adjust the number of rows as needed
                      multiline
                    />
                  </Stack>
                </Card>
              </Grid2>
              <Grid2 xs={12}>
                {!values.manual && (
                  <Grid2 sx={{ mt: 3 }}>
                    <Card sx={{ padding: 3 }}>
                      <Typography variant="h6" sx={{ mb: 3 }}>
                        Tự động
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Khách hàng phải thỏa mãn:</FormLabel>
                          <RadioGroup
                            row
                            aria-label="satisfy"
                            name="satisfy"
                            value={values.satisfy}
                            onChange={handleChange}
                          >
                            <FormControlLabel value="all" control={<Radio />} label="Tất cả các điều kiện" />
                            <FormControlLabel value="once" control={<Radio />} label="Một trong các điều kiện" />
                          </RadioGroup>
                          <FormHelperText>
                            {touched.satisfy && errors.satisfy ? errors.satisfy : ''}
                          </FormHelperText>
                        </FormControl>
                      </Stack>
                      <FieldArray
                        name="auto"
                        render={(arrayHelpers) => (
                          <div>
                            {values.auto && values.auto.length > 0 ? (
                              values.auto.map((auto, index) => (
                                <Stack direction="row" spacing={2} sx={{ mt: 3 }} key={index}>
                                  <FormControl fullWidth>
                                    <Select
                                      labelId={`field-select-label-${index}`}
                                      id={`field-select-${index}`}
                                      name={`auto[${index}].field`}
                                      value={values.auto[index].field || ''}
                                      label="Field"
                                      onChange={handleChange}
                                      error={
                                        touched.auto &&
                                        errors.auto &&
                                        errors.auto[index] &&
                                        errors.auto[index].field
                                      }
                                    >
                                      <MenuItem value="">Vui lòng chọn</MenuItem>
                                      {FIELD_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    <FormHelperText>
                                      {touched.auto &&
                                        errors.auto &&
                                        errors.auto[index] &&
                                        errors.auto[index].field
                                        ? errors.auto[index].field
                                        : ''}
                                    </FormHelperText>
                                  </FormControl>
                                  <FormControl fullWidth>
                                    <Select
                                      labelId={`query-select-label-${index}`}
                                      id={`query-select-${index}`}
                                      name={`auto[${index}].query`}
                                      value={values.auto[index].query || ''}
                                      label="Query"
                                      onChange={handleChange}
                                      error={
                                        touched.auto &&
                                        errors.auto &&
                                        errors.auto[index] &&
                                        errors.auto[index].query
                                      }
                                    >
                                      <MenuItem value="">Vui lòng chọn</MenuItem>
                                      {(values.auto[index].field === 'Tổng đơn hàng' ? QUERY_OPTIONS_TONG_DON_HANG : QUERY_OPTIONS_TRANG_THAI).map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    <FormHelperText>
                                      {touched.auto &&
                                        errors.auto &&
                                        errors.auto[index] &&
                                        errors.auto[index].query
                                        ? errors.auto[index].query
                                        : ''}
                                    </FormHelperText>
                                  </FormControl>
                                  <FormControl fullWidth>
                                    {values.auto[index].field === 'Tổng đơn hàng' ? (
                                      <TextField
                                        id={`status-input-${index}`}
                                        name={`auto[${index}].status`}
                                        value={values.auto[index].status || ''}
                                        onChange={handleChange}
                                        error={
                                          touched.auto &&
                                          errors.auto &&
                                          errors.auto[index] &&
                                          errors.auto[index].status
                                        }

                                      />
                                    ) : (
                                      <Select
                                        labelId={`status-select-label-${index}`}
                                        id={`status-select-${index}`}
                                        name={`auto[${index}].status`}
                                        value={values.auto[index].status || ''}
                                        label="Status"
                                        onChange={handleChange}
                                        error={
                                          touched.auto &&
                                          errors.auto &&
                                          errors.auto[index] &&
                                          errors.auto[index].status
                                        }
                                      >
                                        <MenuItem value="">Vui lòng chọn</MenuItem>
                                        <MenuItem value="Có tài khoản">Có tài khoản</MenuItem>
                                        <MenuItem value="Chưa có tài khoản">Chưa có tài khoản</MenuItem>
                                        <MenuItem value="Đã gửi lời mời đăng ký">Đã gửi lời mời đăng ký</MenuItem>
                                      </Select>
                                    )}
                                    <FormHelperText>
                                      {touched.auto &&
                                        errors.auto &&
                                        errors.auto[index] &&
                                        errors.auto[index].status
                                        ? errors.auto[index].status
                                        : ''}
                                    </FormHelperText>
                                  </FormControl>
                                  <IconButton
                                    onClick={() => arrayHelpers.remove(index)}
                                    color="error"
                                    aria-label="remove"
                                  >
                                    <Iconify icon="eva:trash-2-outline" />
                                  </IconButton>
                                </Stack>
                              ))
                            ) : null}
                            <Button
                              type="button"
                              onClick={() => arrayHelpers.push({ field: '', query: '', status: '' })}
                              variant="contained"
                              color="primary"
                              sx={{ mt: 3 }}
                            >
                              Thêm điều kiện
                            </Button>
                          </div>
                        )}
                      />
                    </Card>


                  </Grid2>
                )}
                <Card sx={{ padding: 3, mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Danh sách khách hàng
                  </Typography>
                  <ConfirmDelete
                    openConfirm={!!confirm}
                    onAgree={dispatchDelete}
                    onClose={() => setConfirm(false)}
                  />
                  <CustomerTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                    onAddCustomerGroup={handleAddCustomerGroup}
                  />

                  <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                      <Table sx={{ minWidth: 800 }}>
                        <CustomerTableHead
                          order={order}
                          orderBy={orderBy}
                          rowCount={customerGroup?.listCustomer?.length || 0}
                          numSelected={selected.length}
                          onRequestSort={handleSort}
                          onSelectAllClick={handleSelectAllClick}
                          headLabel={[
                            { id: 'name', label: 'Tên' },
                            { id: 'phone', label: 'Số điện thoại' },
                            { id: 'email', label: 'Email' },
                            { id: '' },
                          ]}
                        />
                        <TableBody>
                          {dataFiltered
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                              <CustomerTableRow
                                id={row.id}
                                key={`${row._id}-${index}`}
                                name={row.name}
                                phone={row.phone}
                                email={row.email}
                                selected={selected.indexOf(row._id) !== -1}
                                handleClick={(event) => handleClick(event, row._id)}
                                onDelete={handleDelete}
                              />
                            ))}

                          <TableEmptyRows
                            height={77}
                            emptyRows={emptyRows(page, rowsPerPage, customerGroup?.listCustomer?.length || 0)}
                          />

                          {notFound && <TableNoData query={filterName} />}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>

                  <TablePagination
                    page={page}
                    component="div"
                    count={customerGroup?.listCustomer?.length || 0}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Card>
              </Grid2>
              <Grid2 xs={12}>
                <Stack spacing={3} direction="row" mt={2} justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="inherit">
                    Cập nhật nhóm
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
