import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import { renderUrl } from 'src/utils/check';
import { handleToast } from '../../hooks/toast';
import Iconify from '../iconify/iconify';
import './style.css';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

const MiniDropZone = React.memo(({ handleUpload, defaultImg = '', error = null }) => {
  const { fileRejections, acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
  });

  const [url, setUrl] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    if (fileRejections.length > 0) {
      handleToast('error', 'Chỉ nhận tệp có đuôi PNG, JPEG');
    }
  }, [fileRejections]);

  useEffect(() => {
    if (defaultImg !== '') {
      const uri =
        defaultImg instanceof File
          ? URL.createObjectURL(defaultImg)
          : renderUrl(defaultImg, backendUrl);
      setUrl(uri);
    }
  }, [defaultImg]);

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url]
  );

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const files = acceptedFiles.slice(0, 1); // Giới hạn chỉ 1 file
      setUploadFile(files);
      handleUpload(files[0]);
    }
    // eslint-disable-next-line
  }, [acceptedFiles]);

  const removeFile = useCallback(() => {
    setUploadFile(null);
    handleUpload(null);
  }, [handleUpload]);

  const upload = uploadFile && (
    <Box sx={{ position: 'relative', borderRadius: '12px' }}>
      <img
        style={{
          width: '120px',
          maxHeight: '120px',
          objectFit: 'cover',
        }}
        src={URL.createObjectURL(uploadFile[0])}
        alt="Preview"
      />
      <IconButton
        sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white' }}
        color="inherit"
        variant="contained"
        onClick={() => removeFile()}
      >
        <Iconify icon="eva:close-fill" />
      </IconButton>
    </Box>
  );

  return (
    <section className="container mini">
      <div
        {...getRootProps({
          className: `dropzone ${error && 'error'} ${(upload || url !== '') && 'hidden'}`,
        })}
      >
        <input {...getInputProps()} />
        <p className="DropZoneTitle" style={{ textAlign: 'center' }}>
          Kéo thả hoặc chọn ảnh bất kì
        </p>
        <p className="DropZoneTitle" style={{ textAlign: 'center' }}>
          (Chỉ nhận các ảnh có đuôi jpeg, png)
        </p>
        {error && <p className="error">{error}</p>}
      </div>
      <aside>
        {upload}
        {url && !upload && (
          <Box sx={{ position: 'relative', borderRadius: '12px' }}>
            <img
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
              }}
              src={url}
              alt="Preview"
            />
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white' }}
              color="inherit"
              variant="contained"
              onClick={() => setUrl('')}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Box>
        )}
      </aside>
    </section>
  );
});

MiniDropZone.propTypes = {
  handleUpload: PropTypes.func.isRequired,
  singleFile: PropTypes.bool,
  defaultImg: PropTypes.any,
  error: PropTypes.string,
};

export default MiniDropZone;
