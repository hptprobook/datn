import * as React from 'react';
import { Card, Stack, Container } from '@mui/material';
import TitlePage from 'src/components/page/title';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, fetchAllPages, deleteStaticPage } from 'src/redux/slices/staticPageSlices';
import { handleToast } from 'src/hooks/toast';
import LoadingHeader from 'src/components/loading/loading-header';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import StaticPagesTable from '../static-page-table';

export default function StaticWebCreatePage() {
  const [confirm, setConfirm] = React.useState(false);
  const dispatch = useDispatch();
  const statusDelete = useSelector((state) => state.staticPages.statusDelete);
  const status = useSelector((state) => state.staticPages.status);
  const pages = useSelector((state) => state.staticPages.pages);
  const error = useSelector((state) => state.staticPages.error);
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
    dispatch(fetchAllPages());
  }, [dispatch]);
  const handleClickRow = (id) => {
    console.log(id);
  };
  const handleClickAction = (action, id) => {
    if (action === 'delete') {
      setConfirm(id);
    }
  };

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

      <TitlePage title="Thêm trang tĩnh" />
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
