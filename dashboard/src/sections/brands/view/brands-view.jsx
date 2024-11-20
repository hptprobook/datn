import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'src/routes/hooks';
import {
  creates,
  fetchAll,
  setStatus,
  deleteBrand,
  deleteBrands,
} from 'src/redux/slices/brandSlices';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { handleToast } from 'src/hooks/toast';
import { IconButton } from '@mui/material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { IconEdit, IconExcel, IconDelete } from 'src/components/iconify/icon';
import { renderUrl } from 'src/utils/check';
import { handleExport } from 'src/utils/excel';
import ImportExcelModal from 'src/components/modal/import-modal';

// ----------------------------------------------------------------------
const backEnd = import.meta.env.VITE_BACKEND_APP_URL;

export default function BrandsPage() {
  const [confirm, setConfirm] = useState(false);
  const [confirms, setConfirms] = useState(false);
  const [brands, setBrands] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const dispatch = useDispatch();
  const route = useRouter();

  const data = useSelector((state) => state.brands.brands);
  const status = useSelector((state) => state.brands.status);
  const error = useSelector((state) => state.brands.error);
  const statusDelete = useSelector((state) => state.brands.statusDelete);
  const statusCreate = useSelector((state) => state.brands.statusCreate);
  const dataCreates = useSelector((state) => state.brands.dataCreates);
  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);
  useEffect(() => {
    if (statusCreate === 'successful') {
      dispatch(fetchAll());
      dataCreates.successful.forEach((item) => {
        handleToast('success', item.message);
      });
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
    if (statusCreate === 'failed') {
      dispatch(fetchAll());
      handleToast('error', dataCreates.message || 'Thêm biến thể thất bại');
      dataCreates.errors.forEach((item) => {
        handleToast('error', item.message);
      });
      dataCreates.successful.forEach((item) => {
        handleToast('success', item.message);
      });
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
  }, [statusCreate, dataCreates, dispatch]);
  useEffect(() => {
    if (status === 'successful') {
      setBrands(data);
    }
  }, [status, dispatch, data]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      dispatch(fetchAll());
      handleToast('success', 'Xóa nhãn hàng thành công!');
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
    }
    if (statusDelete === 'failed') {
      handleToast('error', error.messages);
      dispatch(setStatus({ key: 'statusDelete', value: 'idle' }));
    }
  }, [statusDelete, dispatch, error]);

  const handleDeleteClick = (id) => {
    setConfirm(id);
  };
  const dispatchDelete = () => {
    dispatch(deleteBrand(confirm));
  };
  const handleEditClick = (id) => () => {
    route.push(id);
  };
  const handleSave = (d) => {
    dispatch(creates(d));
  };

  const renderImage = (params) => {
    const imageUrl = params.formattedValue; // URL của hình ảnh lấy từ params.value
    return (
      <img
        src={imageUrl}
        alt="Hình ảnh"
        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
      />
    );
  };
  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<IconEdit />}
          label="Sửa"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<IconDelete />}
          label="Xóa"
          onClick={() => handleDeleteClick(id)}
          color="inherit"
        />,
      ],
    },
    { field: 'name', headerName: 'Tên nhãn hàng', width: 200 },
    {
      field: 'image',
      headerName: 'Hình ảnh',
      width: 200,
      valueFormatter: (params) => renderUrl(params, backEnd),
      renderCell: renderImage,
    },
    { field: 'slug', headerName: 'Slug', width: 200 },
    { field: 'category', headerName: 'Danh mục', width: 200 },
    { field: 'description', headerName: 'Mô tả', width: 200 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 200 },
    { field: 'updatedAt', headerName: 'Ngày nhập', width: 200 },
    { field: 'website', headerName: 'Trang chủ', width: 200 },
    { field: 'status', headerName: 'Trạng thái', width: 200 },
  ];
  const handleDeleteMany = () => {
    dispatch(
      deleteBrands({
        ids: rowSelectionModel,
      })
    );
  };
  return (
    <Container>
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />
      <ConfirmDelete
        openConfirm={confirms}
        onAgree={handleDeleteMany}
        label="các nhãn hàng đã chọn"
        onClose={() => setConfirms(false)}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Nhãn hàng</Typography>
          <Button
            variant="contained"
            onClick={() => handleExport(brands, 'Danh sách nhãn hàng', 'brands')}
            color="inherit"
            startIcon={<IconExcel />}
          >
            Xuất Excel
          </Button>
          <ImportExcelModal
            validateKey={[
              '_id',
              'name',
              'slug',
              'category',
              'description',
              'image',
              'status',
              'website',
            ]}
            columns={columns
              .filter(
                (col) =>
                  col.field !== 'createdAt' && col.field !== 'updatedAt' && col.field !== 'actions'
              )
              .map((col) => col)}
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
          {rowSelectionModel.length > 0 && (
            <Button variant="text" color="error" onClick={() => setConfirms(true)}>
              Xóa nhiều
            </Button>
          )}
        </Stack>
        <Button
          variant="contained"
          onClick={() => route.push('create')}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Nhãn hàng mới
        </Button>
      </Stack>

      <Card>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            initialState={{
              columns: {
                columnVisibilityModel: {
                  status: false,
                  createdAt: false,
                  updatedAt: false,
                },
              },
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            loading={status === 'loading'}
            slotProps={{
              loadingOverlay: {
                variant: 'linear-progress',
                noRowsVariant: 'linear-progress',
              },
            }}
            columns={columns}
            rows={brands}
            pageSizeOptions={[5, 10]}
            getRowId={(row) => row._id}
            slots={{ toolbar: GridToolbar }}
            localeText={{
              noRowsLabel: 'Không có dữ liệu',
              MuiTablePagination: {
                labelRowsPerPage: 'Số dòng mỗi trang',
              },
              toolbarColumns: 'Cột',
              toolbarFilters: 'Lọc',
              toolbarExport: 'Xuất',
              toolbarExportCSV: 'Xuất CSV',
              toolbarExportPrint: 'In',
              toolbarExportExcel: 'Xuất Excel',
              toolbarDensity: 'Mật độ',
              toolbarDensityCompact: 'Nhỏ',
              toolbarDensityStandard: 'Bình thường',
              toolbarDensityComfortable: 'Lớn',
            }}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            selectionModel={rowSelectionModel}
          />
        </div>
      </Card>
    </Container>
  );
}
