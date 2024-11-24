import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useDispatch, useSelector } from 'react-redux';
import {
  setStatus,
  resetDelete,
  deleteCategory,
  createsCategory,
  fetchAllCategories,
  deleteManyCategory,
} from 'src/redux/slices/categorySlices';
import Iconify from 'src/components/iconify';
import { handleToast } from 'src/hooks/toast';

import { IconButton } from '@mui/material';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { IconEdit, IconExcel, IconDelete } from 'src/components/iconify/icon';
import { handleExport } from 'src/utils/excel';
import ImportExcelModal from 'src/components/modal/import-modal';
import { renderUrl } from 'src/utils/check';

// ----------------------------------------------------------------------
const backEnd = import.meta.env.VITE_BACKEND_APP_URL;

export default function CategoryPage() {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.categories.categories);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);
  const statusDelete = useSelector((state) => state.categories.statusDelete);
  const statusCreate = useSelector((state) => state.categories.statusCreate);
  const dataCreates = useSelector((state) => state.categories.dataCreates);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllCategories());
    } else if (status === 'failed') {
      handleToast('error', 'Có lỗi xảy ra. Vui lòng liên hệ IT');
    }
  }, [status, dispatch, error, categories]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa Danh mục thành công');
      dispatch(resetDelete());
    }
  }, [statusDelete, dispatch]);
  useEffect(() => {
    console.log('dataCreates', dataCreates);
    if (statusCreate === 'successful') {
      dispatch(fetchAllCategories());
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
      dispatch(fetchAllCategories());
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
  const navigate = useNavigate();
  const dispatchDelete = () => {
    dispatch(deleteCategory(confirm));
  };
  const handleMultiDelete = () => {
    setConfirms(false);
    dispatch(deleteManyCategory(rowSelectionModel));
  };

  const [confirm, setConfirm] = useState(false);
  const [confirms, setConfirms] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handleSave = (data) => {
    dispatch(createsCategory(data));
  };
  const handleEditClick = (id) => () => {
    navigate(id);
  };
  // lọc danh mục cha
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
          onClick={() => setConfirm(id)}
          color="inherit"
        />,
      ],
    },
    { field: 'name', headerName: 'Danh mục', width: 200 },
    {
      field: 'imageURL',
      headerName: 'Hình ảnh',
      width: 100,
      valueFormatter: (params) => renderUrl(params, backEnd),
      renderCell: renderImage,
    },
    { field: 'slug', headerName: 'Slug', width: 100 },
    { field: 'parentId', headerName: 'Danh mục cha', width: 100 },
    { field: 'status', headerName: 'Trạng thái', width: 200 },
    { field: 'order', headerName: 'Vị trí', width: 200 },
    { field: 'views', headerName: 'Lượt xem', width: 100 },
    { field: 'description', headerName: 'Mô tả', width: 100 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 200 },
    { field: 'updatedAt', headerName: 'Ngày nhập', width: 200 },
  ];
  return (
    <Container>
      {status === 'loading' && <LoadingFull />}
      <ConfirmDelete
        openConfirm={!!confirm}
        onAgree={dispatchDelete}
        onClose={() => setConfirm(false)}
      />
      <ConfirmDelete
        openConfirm={confirms}
        onAgree={handleMultiDelete}
        onClose={() => setConfirm(false)}
        label="những danh mục đã chọn"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Kho</Typography>

          <IconButton
            aria-label="load"
            variant="contained"
            color="inherit"
            onClick={() => dispatch(fetchAllCategories())}
          >
            <Iconify icon="mdi:reload" />
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          {rowSelectionModel.length > 0 && (
            <Button variant="text" color="error" onClick={() => setConfirms(true)}>
              Xóa nhiều
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() =>
              handleExport(categories, 'Danh sách danh mục', 'categories', [
                'seoOption',
                'createdAt',
                'updatedAt',
              ])
            }
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
              'parentId',
              'status',
              'order',
              'views',
              'description',
              'imageURL',
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
          <Button
            variant="contained"
            onClick={() => navigate('create')}
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Danh mục mới
          </Button>
        </Stack>
      </Stack>

      <Card>
        <div style={{ width: '100%' }}>
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
            rows={categories}
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
