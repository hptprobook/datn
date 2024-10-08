import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { Stack, IconButton } from '@mui/material';
import { renderUrl } from 'src/utils/check';
import { handleToast } from '../../hooks/toast';
import './style.css';
import Iconify from '../iconify/iconify';

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
const MultiImageDropZone = ({ handleUpload, defaultImgs = [], error = null }) => {
  const { fileRejections, acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    multiple: true,
  });
  const [uploadFile, setUploadFile] = useState([...defaultImgs]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      handleToast('error', 'Chỉ nhận tệp có đuôi PNG, JPEG');
    }
  }, [fileRejections]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      // Ensure there's at least one file
      setUploadFile((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }
  }, [acceptedFiles, handleUpload]);

  useEffect(() => {
    handleUpload(uploadFile);
  }, [uploadFile, handleUpload]);
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
    handleUpload(updatedFiles);
  };

  const uploads = uploadFile.map((file, index) => {
    let preview = '';
    // Create object URL for the file preview
    if (file instanceof File) {
      preview = URL.createObjectURL(file);
    } else {
      preview = renderUrl(file, backendUrl);
    }

    return (
      <li key={index}>
        <div className="imageMulti">
          <div>
            <img className="img" src={preview} alt={`Preview ${index}`} />
          </div>
          {file instanceof File ? (
            <Stack direction="column" justifyContent="center">
              <p> {`${file.name.slice(0, 10)}...`}</p>
              <p>
                {file.size} B - {file.type}
              </p>
            </Stack>
          ) : (
            <p>{file.slice(-20)}</p>
          )}
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

  return (
    <section className="container ImageDropZone">
      <div
        {...getRootProps({
          className: `dropzone ${error && 'error'}`,
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
      <aside>{uploads.length > 0 && <ul>{uploads}</ul>}</aside>
    </section>
  );
};

MultiImageDropZone.propTypes = {
  handleUpload: PropTypes.func.isRequired,
  singleFile: PropTypes.bool,
  defaultImgs: PropTypes.array,
  error: PropTypes.string,
};

export default MultiImageDropZone;
