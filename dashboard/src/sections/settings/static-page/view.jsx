import * as React from 'react';
import { Card, Stack, Button, Container } from '@mui/material';
import TitlePage from 'src/components/page/title';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStatus,
  fetchAllPages,
  deleteStaticPage,
  createsStaticPage,
  deletesStaticPage,
} from 'src/redux/slices/staticPageSlices';
import { handleToast } from 'src/hooks/toast';
import LoadingHeader from 'src/components/loading/loading-header';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import { useNavigate } from 'react-router-dom';
import ImportExcelModal from 'src/components/modal/import-modal';
import { IconExcel } from 'src/components/iconify/icon';
import { handleExport } from 'src/utils/excel';
import StaticPagesTable from '../static-page-table';

export default function StaticWebSettingPage() {
  const [confirm, setConfirm] = React.useState(false);
  const dispatch = useDispatch();
  const statusDelete = useSelector((state) => state.staticPages.statusDelete);
  const status = useSelector((state) => state.staticPages.status);
  const pages = useSelector((state) => state.staticPages.pages);
  const error = useSelector((state) => state.staticPages.error);
  const dataCreates = useSelector((state) => state.staticPages.creates);
  const statusCreate = useSelector((state) => state.staticPages.statusCreate);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (statusDelete === 'successful') {
      setConfirm(false);
      dispatch(fetchAllPages());
      handleToast('success', 'Xóa thành công');
      dispatch(
        setStatus({
          key: 'statusDelete',
          value: 'idle',
        })
      );
    }
    if (statusDelete === 'failed') {
      setConfirm(false);
      handleToast('error', error?.message || 'Có lỗi xảy ra');
    }
  }, [dispatch, error, statusDelete]);
  React.useEffect(() => {
    if (statusCreate === 'successful') {
      dispatch(fetchAllPages());
      dataCreates.successful.forEach((item) => {
        handleToast('success', item?.message || 'Tạo mới thành công');
      });
      dispatch(
        setStatus({
          key: 'statusCreate',
          value: 'idle',
        })
      );
    }
    if (statusCreate === 'failed') {
      dispatch(fetchAllPages());
      dataCreates?.errors.forEach((item) => {
        handleToast('error', item.message);
      });
      dataCreates?.successful.forEach((item) => {
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
  React.useEffect(() => {
    dispatch(fetchAllPages());
  }, [dispatch]);
  const handleClickRow = (id) => {
    console.log('id', id);
    // handleToast('info', 'Chức năng xem trước đang được phát triển');
  };
  const handleClickAction = (action, id) => {
    if (action === 'delete') {
      setConfirm(id);
    }
    if (action === 'edit') {
      navigate(id);
    }
    if (action === 'deletes') {
      dispatch(
        deletesStaticPage({
          ids: id,
        })
      );
    }
  };
  const handleSave = (data) => {
    dispatch(createsStaticPage(data));
  };
  const columns = [
    { field: 'title', headerName: 'Tiêu đề', width: 200 },

    { field: 'slug', headerName: 'Slug', width: 100 },
    { field: 'content', headerName: 'Nội dung', width: 300 },
    { field: 'type', headerName: 'Loại', width: 50 },
    { field: 'metaTitle', headerName: 'Tiêu SEO', width: 200 },
    { field: 'metaDescription', headerName: 'Mô tả SEO', width: 100 },
    { field: 'metaKeywords', headerName: 'Từ khóa SEO', width: 100 },
  ];
  return (
    <Container>
      <ConfirmDelete
        openConfirm={confirm}
        label="trang tĩnh đã chọn"
        onAgree={() => dispatch(deleteStaticPage(confirm))}
        onClose={() => setConfirm(false)}
      />
      {statusDelete === 'loading' && <LoadingHeader />}
      {status === 'loading' && <LoadingFull />}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <TitlePage title="Cài đặt trang tĩnh" onClick={() => dispatch(fetchAllPages())} />
        <Stack direction="row" gap={2}>
          <Button
            variant="contained"
            onClick={() =>
              handleExport(pages, 'Danh sách trang tĩnh', 'static-pages', [
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
              'title',
              'metaTitle',
              'metaDescription',
              'metaKeywords',
              'slug',
              'content',
              'type',
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
          <Button variant="contained" color="inherit" onClick={() => navigate('create')}>
            Thêm trang tĩnh
          </Button>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Card
          sx={{
            padding: 2,
          }}
        >
          <StaticPagesTable
            data={pages}
            onClickRow={handleClickRow}
            onClickAction={handleClickAction}
          />
        </Card>
      </Stack>
    </Container>
  );
}
