import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Box, Modal, Button, Skeleton, IconButton } from '@mui/material';
import {
  IconCopy,
  IconNext,
  IconPrev,
  IconClose,
  IconFolder,
  IconFolderOpen,
} from 'src/components/iconify/icon';
import { getFiles, getFolder, deleteFile, uploadFile } from 'src/redux/slices/fileManagerSlices';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { renderUrl } from 'src/utils/check';
import { handleToast } from 'src/hooks/toast';
import LoadingFull from 'src/components/loading/loading-full';
import MiniDropZone from 'src/components/drop-zone-upload/mini-dropzone';

// ----------------------------------------------------------------------
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

const LoadingFolder = () => (
  <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
    <Skeleton variant="rectangular" width={30} height={30} />
    <Skeleton variant="rectangular" width={90} height={25} />
  </Stack>
);
const LoadingFile = () => (
  <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
    <Skeleton variant="rectangular" width={120} height={120} animation="wave" />
    <Skeleton variant="rectangular" width={120} height={120} animation="wave" />
    <Skeleton variant="rectangular" width={120} height={120} animation="wave" />
  </Stack>
);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function FileManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectFolder, setSelectFolder] = useState('');
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(2);
  const [iShow, setIShow] = useState(false);
  useEffect(() => {
    dispatch(getFolder());
  }, [dispatch]);
  const handleGetFiles = (folder, l = 10) => {
    dispatch(getFiles({ folder, limit: l }));
  };
  const folders = useSelector((state) => state.files.folders);
  const status = useSelector((state) => state.files.status);
  const files = useSelector((state) => state.files.files);
  const statusFiles = useSelector((state) => state.files.statusFiles);
  const statusDelete = useSelector((state) => state.files.statusDelete);
  const statusUpload = useSelector((state) => state.files.statusUpload);

  useEffect(() => {
    if (searchParams.has('folder') && status === 'successful') {
      setSelectFolder(searchParams.get('folder'));
      if (!folders.includes(searchParams.get('folder')) || searchParams.get('folder') === '') {
        searchParams.delete('folder');
        searchParams.set('folder', folders[0]);
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, status, folders, setSearchParams]);
  useEffect(() => {
    if (statusDelete === 'successful') {
      handleToast('success', 'Xóa tệp thành công');
      handleGetFiles(selectFolder, limit);
    }
    // eslint-disable-next-line
  }, [statusDelete]);
  useEffect(() => {
    if (statusUpload === 'successful') {
      handleToast('success', 'Tải tệp lên thành công');
      handleGetFiles(selectFolder, limit);
    }
    // eslint-disable-next-line
  }, [statusUpload]);

  useEffect(() => {
    if (selectFolder) {
      handleGetFiles(selectFolder, limit);
    }
    // eslint-disable-next-line
  }, [selectFolder]);
  const handleDeleteFile = (name) => {
    dispatch(deleteFile({ name }));
  };
  const handleSelectFolder = (folder) => {
    setSelectFolder(folder);
    searchParams.set('folder', folder);
    setSearchParams(searchParams);
  };
  const handleSlideImage = (t) => {
    if (t === 'next') {
      if (iShow === files.length - 1) {
        setIShow(0);
      } else {
        setIShow(iShow + 1);
      }
    }
    if (t === 'prev') {
      if (iShow === 0) {
        setIShow(files.length - 1);
      } else {
        setIShow(iShow - 1);
      }
    }
  };
  const copyToClipboard = async (t) => {
    try {
      await navigator.clipboard.writeText(t);
      handleToast('success', 'Sao chép thành công');
    } catch (error) {
      handleToast('error', 'Sao chép thất bại');
    }
  };
  const handleUpload = (file) => {
    if (file) {
      dispatch(
        uploadFile({
          file: {
            name: 'file',
            file,
          },
          data: {
            folder: selectFolder,
          },
        })
      );
    }
  };
  return (
    <Container>
      {statusDelete === 'loading' && <LoadingFull />}
      <Modal
        open={iShow !== false}
        onClose={() => setIShow(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {iShow !== false && (
            <img
              style={{
                width: '100%',
                height: '90vh',
                objectFit: 'cover',
              }}
              src={renderUrl(files[iShow], backendUrl)}
              alt={files[iShow]}
            />
          )}
          <IconButton
            onClick={() => setIShow(false)}
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255)',
            }}
          >
            <IconClose />
          </IconButton>
          <IconButton
            onClick={() => handleSlideImage('prev')}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '-80px',
              backgroundColor: '#fff',
              ':hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <IconPrev />
          </IconButton>
          <IconButton
            onClick={() => handleSlideImage('next')}
            sx={{
              position: 'absolute',
              top: '50%',
              right: '-80px',
              backgroundColor: '#fff',
              ':hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <IconNext />
          </IconButton>
        </Box>
      </Modal>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Quản lý tệp</Typography>
      </Stack>

      <Card
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
          {folders?.map((folder) => (
            <Box
              key={folder}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: selectFolder === folder ? '#f0f0f0' : 'transparent',
              }}
              onClick={() => handleSelectFolder(folder)}
            >
              {selectFolder === folder ? <IconFolderOpen /> : <IconFolder />}
              <Typography variant="p">{folder}</Typography>
            </Box>
          ))}
          {status === 'loading' && <LoadingFolder />}
        </Stack>
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
          <MiniDropZone
            handleUpload={handleUpload}
            // error={error}
          />
          {files?.map((f, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 1,
                p: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: selectFolder === f ? '#f0f0f0' : 'transparent',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIShow(i);
              }}
            >
              <img
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                }}
                src={renderUrl(f, backendUrl)}
                alt={f}
              />
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(f);
                  }}
                >
                  <IconCopy />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(f);
                  }}
                >
                  <IconClose />
                </IconButton>
              </Box>
            </Box>
          ))}
          {files?.length === limit && (
            <Button
              variant="contained"
              onClick={() => {
                setLimit(limit + 10);
                handleGetFiles(selectFolder, limit + 10);
              }}
            >
              Xem thêm
            </Button>
          )}
          {statusFiles === 'loading' && <LoadingFile />}
        </Stack>
      </Card>
    </Container>
  );
}
