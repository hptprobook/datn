import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Box, Button, IconButton } from '@mui/material';
import { setStatus } from 'src/redux/slices/settingSlices';
import { renderUrl } from 'src/utils/check';
import { handleToast } from '../../hooks/toast';
import './style.css';
import Iconify from '../iconify/iconify';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
const ImageDropZone = ({ handleUpload, singleFile = false, defaultImg = '' }) => {
  const { fileRejections, acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    multiple: !singleFile,
  });
  const [url, setUrl] = useState('');
  const [uploadFile, setUploadFile] = useState([]);
  const status = useSelector((state) => state.settings.statusUploadWeb);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === 'succeeded') {
      handleToast('success', 'Upload ảnh thành công');
      dispatch(setStatus({ key: 'statusUploadWeb', value: 'idle' }));
      setUploadFile([]);
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      handleToast('error', 'Chỉ nhận tệp có đuôi PNG, JPEG');
    }
  }, [fileRejections]);

  useEffect(() => {
    if (defaultImg !== '') {
      const uri = renderUrl(defaultImg, backendUrl);
      setUrl(uri);
    }
  }, [defaultImg]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      // Ensure there's at least one file
      if (singleFile) {
        setUploadFile(acceptedFiles);
        handleUpload(acceptedFiles[0]);
      } else {
        setUploadFile([acceptedFiles[0]]);
        handleUpload([acceptedFiles[0]]);
      }
    }
  }, [acceptedFiles, singleFile, handleUpload]);

  // Revoke object URLs to avoid memory leaks
  useEffect(
    () =>
      // Cleanup function to revoke object URLs
      () => {
        uploadFile.forEach((file) => URL.revokeObjectURL(file.preview));
      },
    [uploadFile]
  );

  const removeFile = (index) => {
    const updatedFiles = [...uploadFile];
    updatedFiles.splice(index, 1);
    setUploadFile(updatedFiles);
  };

  const uploads = uploadFile.map((file, index) => {
    // Create object URL for the file preview
    const preview = URL.createObjectURL(file);

    return (
      <li key={file.path}>
        <div>
          <img src={preview} alt={`Preview ${index}`} />
          {`${file.path.slice(0, 30)}...`} - {file.size} B - {file.type}
        </div>
        <Button color="inherit" variant="contained" onClick={() => removeFile(index)}>
          Xóa
        </Button>
      </li>
    );
  });

  // Preview for single file mode
  const upload = uploadFile[0] ? (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '12px',
      }}
    >
      <img src={URL.createObjectURL(uploadFile[0])} alt="Preview" />
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'white',
        }}
        color="inherit"
        variant="contained"
        onClick={() => removeFile(0)}
      >
        <Iconify icon="eva:close-fill" />
      </IconButton>
    </Box>
  ) : null;

  return (
    <section className="container ImageDropZone">
      <div {...getRootProps({ className: `dropzone ${(upload || url !== '') && 'hidden'}` })}>
        <input {...getInputProps()} />
        <p className="DropZoneTitle" style={{ textAlign: 'center' }}>
          Kéo thả hoặc chọn ảnh bất kì
        </p>
        <p className="DropZoneTitle" style={{ textAlign: 'center' }}>
          (Chỉ nhận các ảnh có đuôi jpeg, png)
        </p>
      </div>
      <aside>
        {!singleFile && uploads.length > 0 && <ul>{uploads}</ul>}
        {(singleFile || url !== '') && upload}
        {url && !upload && (
          <Box
            sx={{
              position: 'relative',
              borderRadius: '12px',
            }}
          >
            <img src={url} alt="Preview" />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'white',
              }}
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
};

ImageDropZone.propTypes = {
  handleUpload: PropTypes.func.isRequired,
  singleFile: PropTypes.bool,
  defaultImg: PropTypes.string,
};

export default ImageDropZone;
