import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import { renderUrl } from 'src/utils/check';
import { handleToast } from '../../hooks/toast';
import './style.css';
import Iconify from '../iconify/iconify';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
const ImageDropZone = ({ handleUpload, singleFile = false, defaultImg = '', error = null }) => {
  const { fileRejections, acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    multiple: !singleFile,
  });
  const [url, setUrl] = useState('');
  const [uploadFile, setUploadFile] = useState([]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      handleToast('error', 'Chỉ nhận tệp có đuôi PNG, JPEG');
    }
  }, [fileRejections]);

  useEffect(() => {
    if (defaultImg !== '') {
      if (defaultImg instanceof File) {
        const uri = URL.createObjectURL(defaultImg);
        setUrl(uri);
      } else {
        const uri = renderUrl(defaultImg, backendUrl);
        setUrl(uri);
      }
    }
  }, [defaultImg]);
  useEffect(() => {
    if (acceptedFiles.length > 0) {
      // Ensure there's at least one file
      if (singleFile) {
        setUploadFile(acceptedFiles);
        handleUpload(acceptedFiles[0]);
      } else {
        setUploadFile((prevFiles) => [...prevFiles, ...acceptedFiles]);
        handleUpload(acceptedFiles);
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
    if (singleFile) {
      handleUpload(null);
    } else {
      handleUpload(updatedFiles);
    }
  };

  const uploads = uploadFile.map((file, index) => {
    // Create object URL for the file preview
    const preview = URL.createObjectURL(file);

    return (
      <li key={index}>
        <div className="imageMulti">
          <div>
            <img className="img" src={preview} alt={`Preview ${index}`} />
          </div>
          <div>
            <p>{`${file.path.slice(0, 30)}...`}</p>
            <p>
              {file.size} B - {file.type}
            </p>
          </div>
          <IconButton
            sx={{
              backgroundColor: 'white',
              height: 40,
              width: 40,
            }}
            color="inherit"
            variant="contained"
            onClick={() => removeFile(index)}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </div>
      </li>
    );
  });

  // Preview for single file mode
  const upload =
    uploadFile[0] && singleFile ? (
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
  defaultImg: PropTypes.any,
  error: PropTypes.string,
};

export default ImageDropZone;
