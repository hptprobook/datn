import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import { renderUrl } from 'src/utils/check';
import { handleToast } from '../../hooks/toast';
import Iconify from '../iconify/iconify';
import './style.css';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;

const ImageDropZone = React.memo(({ handleUpload, singleFile = false, defaultImg = '', error = null }) => {
  const { fileRejections, acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
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
      const uri = defaultImg instanceof File ? URL.createObjectURL(defaultImg) : renderUrl(defaultImg, backendUrl);
      setUrl(uri);
    }
  }, [defaultImg]);

  useEffect(() => () => {
      if (url) URL.revokeObjectURL(url);
    }, [url]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const files = singleFile ? acceptedFiles.slice(0, 1) : acceptedFiles;
      setUploadFile((prevFiles) => [...prevFiles, ...files]);
      handleUpload(singleFile ? files[0] : files);
    }
  }, [acceptedFiles, singleFile, handleUpload]);

  const removeFile = useCallback((index) => {
    setUploadFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
    handleUpload(singleFile ? null : uploadFile.filter((_, i) => i !== index));
  }, [uploadFile, singleFile, handleUpload]);

  const uploads = uploadFile.map((file, index) => {
    const preview = URL.createObjectURL(file);
    return (
      <li key={index}>
        <div className="imageMulti">
          <img className="img" src={preview} alt={`Preview ${index}`} />
          <div>
            <p>{`${file.path.slice(0, 30)}...`}</p>
            <p>{file.size} B - {file.type}</p>
          </div>
          <IconButton sx={{ backgroundColor: 'white', height: 40, width: 40 }} color="inherit" variant="contained" onClick={() => removeFile(index)}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </div>
      </li>
    );
  });

  const upload = uploadFile[0] && singleFile && (
    <Box sx={{ position: 'relative', borderRadius: '12px' }}>
      <img src={URL.createObjectURL(uploadFile[0])} alt="Preview" />
      <IconButton sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white' }} color="inherit" variant="contained" onClick={() => removeFile(0)}>
        <Iconify icon="eva:close-fill" />
      </IconButton>
    </Box>
  );

  return (
    <section className="container ImageDropZone">
      <div {...getRootProps({ className: `dropzone ${error && 'error'} ${(upload || url !== '') && 'hidden'}` })}>
        <input {...getInputProps()} />
        <p className="DropZoneTitle" style={{ textAlign: 'center' }}>Kéo thả hoặc chọn ảnh bất kì</p>
        <p className="DropZoneTitle" style={{ textAlign: 'center' }}>(Chỉ nhận các ảnh có đuôi jpeg, png)</p>
        {error && <p className="error">{error}</p>}
      </div>
      <aside>
        {!singleFile && uploads.length > 0 && <ul>{uploads}</ul>}
        {(singleFile || url !== '') && upload}
        {url && !upload && (
          <Box sx={{ position: 'relative', borderRadius: '12px' }}>
            <img src={url} alt="Preview" />
            <IconButton sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white' }} color="inherit" variant="contained" onClick={() => setUrl('')}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Box>
        )}
      </aside>
    </section>
  );
});

ImageDropZone.propTypes = {
  handleUpload: PropTypes.func.isRequired,
  singleFile: PropTypes.bool,
  defaultImg: PropTypes.any,
  error: PropTypes.string,
};

export default ImageDropZone;
