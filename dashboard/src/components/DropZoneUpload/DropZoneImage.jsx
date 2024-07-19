// import React, { useEffect, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import  {handleToast } from "../../hooks/toast";
// import './style.css';

// // eslint-disable-next-line import/no-extraneous-dependencies

// const ImageDropZone = ({ handleUpload }) => {
//     const {
//         fileRejections,
//         acceptedFiles,
//         getRootProps,
//         getInputProps
//     } = useDropzone({
//         accept: {
//             'image/jpeg': [],
//             'image/png': []
//         }
//     });

//     const [uploadFile, setUploadFile] = useState([]);
//     const [uploadFileError, setUploadFileError] = useState(false);

//     useEffect(() => {
//         if (fileRejections.length > 0) {
//             setUploadFileError(true);
//             handleToast('error', 'Chỉ nhận tệp có đuôi PNG, JPEG');
//         } else {
//             setUploadFileError(false);
//         }
//     }, [fileRejections]);

//     useEffect(() => {
//         setUploadFile(acceptedFiles);
//     }, [acceptedFiles]);

//     useEffect(() => {
//         handleUpload(uploadFile);
//     }, [uploadFile]);

//     const removeFile = (index) => {
//         const updatedFiles = [...uploadFile];
//         updatedFiles.splice(index, 1);
//         setUploadFile(updatedFiles);
//     };

//     const upload = uploadFile.map((file, index) => (
//         <li key={file.path}>
//             <div>
//                 <img
//                     src={URL.createObjectURL(file)}
//                     alt={`Preview ${index}`}
//                 />
//                 {file.path.slice(0, 30) + '...'} - {file.size} B - {file.type}
//             </div>
//             <div className='DeletePreviewButton' onClick={() => removeFile(index)}>Xóa</div>
//         </li>
//     ));

//     return (
//         <section className="container ImageDropZone">
//             <div {...getRootProps({ className: 'dropzone' })}>
//                 <input {...getInputProps()} />
//                 <p className='DropZoneTitle' style={{ textAlign: 'center' }}>Kéo thả hoặc chọn ảnh bất kì</p>
//                 <p className='DropZoneTitle' style={{ textAlign: 'center' }}>(Chỉ nhận các ảnh có đuôi jpeg, png)</p>
//             </div>
//             <aside>
//                 <ul className='UploadImagePreview'>{upload}</ul>
//             </aside>
//         </section>
//     );
// }

// export default ImageDropZone;