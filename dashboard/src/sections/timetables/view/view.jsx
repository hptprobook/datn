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
import { useDispatch, useSelector } from 'react-redux';

import { deleteUser, resetDelete } from 'src/redux/slices/userSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useRouter } from 'src/routes/hooks';
import { handleToast } from 'src/hooks/toast';

import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { emptyRows } from 'src/components/table/utils';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { createTimetable, fetchAllTimetables, setStatus } from 'src/redux/slices/timetableSlices';
import Grid2 from '@mui/material/Unstable_Grid2';
import { fetchAll } from 'src/redux/slices/warehouseSlices';
import * as Yup from 'yup';
import { fetchAllStaffs } from 'src/redux/slices/staffSlices';
import { useFormik } from 'formik';
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import TimetableTableToolbar from '../time-table-toolbar';
import TimetableTableRow from '../timetable-table-row';
import TimetableTableHead from '../timetable-table-head';
import dayjs from 'dayjs';
import FormHelpTextError from 'src/components/errors/form-error';
import LoadingHeader from 'src/components/loading/loading-header';
// ----------------------------------------------------------------------
export const TIMETABLE_SCHEMA = Yup.object().shape({
  type: Yup.string()
    .oneOf(['morning', 'afternoon', 'evening', 'night', 'all'], 'Ca làm không hợp lệ')
    .default('morning'),
  status: Yup.string().oneOf(['pending', 'checked', 'doing', 'complete']).default('pending'),
  date: Yup.date().default(() => new Date()),
  startTime: Yup.date()
    .typeError('Thời gian bắt đầu không hợp lệ')
    .required('Thời gian bắt đầu không được để trống'),
  endTime: Yup.date()
    .typeError('Thời gian kết thúc không hợp lệ')
    .required('Thời gian kết thúc không được để trống'),
  staffId: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID nhân viên không hợp lệ')
    .required('ID nhân viên không được để trống'),
  branchId: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID chi nhánh không hợp lệ')
    .required('ID chi nhánh không được để trống'),
  note: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
});
export default function TimetablePage() {
  const dispatch = useDispatch();
  const [timetables, setTimetables] = useState([]);

  const data = useSelector((state) => state.timetables.timetables);
  const status = useSelector((state) => state.timetables.status);
  const branches = useSelector((state) => state.warehouses.warehouses);
  const staffs = useSelector((state) => state.staffs.staffs);
  const error = useSelector((state) => state.timetables.error);
  const statusCreate = useSelector((state) => state.timetables.statusCreate);
  const statusDelete = useSelector((state) => state.timetables.statusDelete);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllTimetables());
      dispatch(fetchAll());
      dispatch(fetchAllStaffs());
    } else if (status === 'failed') {
      console.error(error);
    } else if (status === 'successful') {
      setTimetables(data);
    }
  }, [status, dispatch, error, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa người dùng thành công');
      dispatch(resetDelete());
    }
  }, [statusDelete, dispatch]);
  useEffect(() => {
    if (statusCreate === 'successful') {
      handleToast('success', 'Thêm lịch làm việc thành công');
      dispatch(fetchAllTimetables());
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    } else if (statusCreate === 'failed') {
      handleToast('error', 'Thêm lịch làm việc thất bại');
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
  }, [statusCreate, dispatch]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const route = useRouter();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = timetables.map((n) => n.date);
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

  const [confirm, setConfirm] = useState(false);
  const dispatchDelete = () => {
    dispatch(deleteUser(confirm));
  };
  const formik = useFormik({
    initialValues: {
      type: 'morning',
      status: 'pending',
      date: dayjs(),
      startTime: dayjs(),
      endTime: dayjs(),
      staffId: '',
      branchId: '',
      note: '',
    },
    validationSchema: TIMETABLE_SCHEMA,
    onSubmit: (values) => {
      const newValues = JSON.parse(JSON.stringify(values));

      newValues.date = dayjs(newValues.date).startOf('day').valueOf();
      newValues.startTime = dayjs(newValues.date)
        .hour(dayjs(newValues.startTime).hour())
        .minute(dayjs(newValues.startTime).minute())
        .valueOf();

      // Update endTime to match `date` but keep the time component
      newValues.endTime = dayjs(newValues.date)
        .hour(dayjs(newValues.endTime).hour())
        .minute(dayjs(newValues.endTime).minute())
        .valueOf();
      // Validate times
      const isStartTimeBeforeEndTime = dayjs(newValues.startTime).isBefore(
        dayjs(newValues.endTime)
      );

      if (!isStartTimeBeforeEndTime) {
        handleToast('error', 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc');
        return;
      }

      console.log(newValues);
      dispatch(createTimetable(newValues));
    },
  });
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      {statusDelete === 'loading' && <LoadingFull />}
      {statusCreate === 'loading' && <LoadingHeader />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
        label="người dùng đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">Lịch làm việc</Typography>
          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAllTimetables())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => route.push('create')}
        >
          Thêm lịch làm việc
        </Button>
      </Stack>

      <Grid2 container spacing={3}>
        <Grid2 xs={6}>
          <Card
            sx={{
              p: 2,
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Thêm mới</Typography>

                  <Button
                    variant="contained"
                    color="inherit"
                    type="submit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    Thêm
                  </Button>
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker, TimePicker']}>
                    <Stack width="100%" spacing={2}>
                      <DatePicker
                        sx={{
                          width: '100%',
                        }}
                        label="Ngày làm việc"
                        value={formik.values.date}
                        onChange={(date) => formik.setFieldValue('date', date)}
                      />
                      <TimePicker
                        sx={{
                          width: '100%',
                        }}
                        label="Thời gian bắt đầu"
                        value={formik.values.startTime}
                        onChange={(s) => formik.setFieldValue('startTime', s)}
                      />
                      <TimePicker
                        sx={{
                          width: '100%',
                        }}
                        label="Thời gian kết thúc"
                        value={formik.values.endTime}
                        onChange={(t) => formik.setFieldValue('endTime', t)}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="type-select-label">Ca</InputLabel>
                        <Select
                          labelId="type-select-label"
                          id="type-select"
                          value={formik.values.type}
                          name="type"
                          label="Ca"
                          onChange={formik.handleChange}
                          error={formik.touched.type && Boolean(formik.errors.type)}
                        >
                          <MenuItem value="morning">Ca sáng</MenuItem>
                          <MenuItem value="afternoon">Ca chiều</MenuItem>
                          <MenuItem value="evening">Ca tối</MenuItem>
                          <MenuItem value="night">Ca đêm</MenuItem>
                          <MenuItem value="all">Cả ngày</MenuItem>
                        </Select>
                        <FormHelpTextError label={formik.touched.type && formik.errors.type} />
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="staffId-select-label">Nhân viên</InputLabel>
                        <Select
                          labelId="staffId-select-label"
                          id="staffId-select"
                          value={formik.values.staffId}
                          name="staffId"
                          label="Nhân viên"
                          onChange={formik.handleChange}
                          error={formik.touched.staffId && Boolean(formik.errors.staffId)}
                        >
                          {staffs?.map((staff) => (
                            <MenuItem key={staff._id} value={staff._id}>
                              {staff.name} - {staff.staffCode}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelpTextError
                          label={formik.touched.staffId && formik.errors.staffId}
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="branchId-select-label">Chi nhánh</InputLabel>
                        <Select
                          labelId="branchId-select-label"
                          id="branchId-select"
                          value={formik.values.branchId}
                          name="branchId"
                          label="Chi nhánh"
                          error={formik.touched.branchId && Boolean(formik.errors.branchId)}
                          onChange={formik.handleChange}
                        >
                          {branches?.map((v) => (
                            <MenuItem key={v._id} value={v._id}>
                              {v.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelpTextError
                          label={formik.touched.branchId && formik.errors.branchId}
                        />
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Ghi chú"
                        multiline
                        rows={4}
                        value={formik.values.note}
                        name="note"
                        onChange={formik.handleChange}
                      />
                    </Stack>
                  </DemoContainer>
                </LocalizationProvider>
              </Stack>
            </form>
          </Card>
        </Grid2>
        <Grid2 xs={6}>
          <Card>
            <TimetableTableToolbar numSelected={selected.length} />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <TimetableTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={timetables.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'name', label: 'Thứ' },
                      { id: 'email', label: 'Ngày' },
                      { id: 'number', label: 'Số ca' },
                    ]}
                  />
                  <TableBody>
                    {timetables
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TimetableTableRow
                          key={row.date}
                          name={row.article}
                          date={row.date}
                          onClickRow={() => route.push(`detail/${row.date}`)}
                          number={row.numberOfTimetables}
                          selected={selected.indexOf(row.date) !== -1}
                          handleClick={(event) => handleClick(event, row.date)}
                        />
                      ))}

                    <TableEmptyRows
                      col={3}
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, timetables.length)}
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              labelRowsPerPage="Số dòng mỗi trang"
              count={timetables.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}
