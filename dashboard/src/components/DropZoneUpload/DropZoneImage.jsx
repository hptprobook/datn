import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { handleToast } from "../../hooks/toast";
import './style.css';

const ImageDropZone = ({ handleUpload, singleFile = false }) => {
    const {
        fileRejections,
        acceptedFiles,
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        multiple: !singleFile
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
    }, [uploadFile, handleUpload]);

    const removeFile = (index) => {
        const updatedFiles = [...uploadFile];
        updatedFiles.splice(index, 1);
        setUploadFile(updatedFiles);
    };

    const upload = uploadFile.map((file, index) => (
        <li key={file.path}>
            <div>
                <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                />
                {`${file.path.slice(0, 30)  }...`} - {file.size} B - {file.type}
            </div>
            <button type="button" className='DeletePreviewButton' onClick={() => removeFile(index)}>Xóa</button>
        </li>
    ));

    return (
        <section className="container ImageDropZone">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p className='DropZoneTitle' style={{ textAlign: 'center' }}>Kéo thả hoặc chọn ảnh bất kì</p>
                    <p className='DropZoneTitle' style={{ textAlign: 'center' }}>(Chỉ nhận các ảnh có đuôi jpeg, png)</p>
                </div>
            <aside>
                <ul className='UploadImagePreview'>{upload}</ul>
            </aside>
        </section>
    );
}

ImageDropZone.propTypes = {
    handleUpload: PropTypes.func.isRequired,
    singleFile: PropTypes.bool
};

export default ImageDropZone;