import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Box, Button, IconButton } from '@mui/material';
import { handleToast } from '../../hooks/toast';
import './style.css';
import Iconify from '../iconify/iconify';

const ImageDropZone = ({ handleUpload, singleFile = false }) => {
  const { fileRejections, acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    multiple: !singleFile,
  });

  const [uploadFile, setUploadFile] = useState([]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      handleToast('error', 'Chỉ nhận tệp có đuôi PNG, JPEG');
    }
  }, [fileRejections]);

  useEffect(() => {
    if (singleFile && acceptedFiles.length > 1) {
      setUploadFile([acceptedFiles[0]]);
    } else {
      setUploadFile(acceptedFiles);
    }
  }, [acceptedFiles, singleFile]);

  useEffect(() => {
    handleUpload(uploadFile);
  }, [handleUpload, uploadFile]);

  // Revoke object URLs to avoid memory leaks
  useEffect(() => 
    // Cleanup function to revoke object URLs
     () => {
      uploadFile.forEach((file) => URL.revokeObjectURL(file.preview));
    }
  , [uploadFile]);

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
      <div {...getRootProps({ className: `dropzone ${upload && 'hidden'}` })}>
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
        {singleFile && upload}
      </aside>
    </section>
  );
};

ImageDropZone.propTypes = {
  handleUpload: PropTypes.func.isRequired,
  singleFile: PropTypes.bool,
};

export default ImageDropZone;
