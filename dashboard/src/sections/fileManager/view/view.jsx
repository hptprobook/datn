import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Box, IconButton, Modal, Skeleton } from '@mui/material';
import {
  IconClose,
  IconFolder,
  IconFolderOpen,
  IconNext,
  IconPrev,
} from 'src/components/iconify/icon';
import { getFiles, getFolder } from 'src/redux/slices/fileManagerSlices';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { renderUrl } from 'src/utils/check';

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
  const [iShow, setIShow] = useState(false);
  useEffect(() => {
    dispatch(getFolder());
  }, [dispatch]);
  const handleGetFiles = (folder, limit = 10) => {
    dispatch(getFiles({ folder, limit }));
  };
  const folders = useSelector((state) => state.files.folders);
  const status = useSelector((state) => state.files.status);
  const files = useSelector((state) => state.files.files);
  const statusFiles = useSelector((state) => state.files.statusFiles);

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
    if (selectFolder) {
      handleGetFiles(selectFolder);
    }
    // eslint-disable-next-line
  }, [selectFolder]);
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
  return (
    <Container>
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
          {files?.map((f, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: selectFolder === f ? '#f0f0f0' : 'transparent',
              }}
              onClick={() => setIShow(i)}
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
            </Box>
          ))}
          {statusFiles === 'loading' && <LoadingFile />}
        </Stack>
      </Card>
    </Container>
  );
}
