import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/imgs');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '.jpg');
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});
const getFilenames = (filesArray, field) => {
    return filesArray.map((file) => file[field]);
};

const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const uploadImgs = (fieldName, count = 10) => {
    return (req, res) => {
        return new Promise((resolve, reject) => {
            upload.array(fieldName, count)(req, res, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const files = req.files;
                const filenames = getFilenames(files, 'filename');
                resolve(filenames);
            });
        });
    };
};

const deleteImg = (name) => {
    const filePath = path.resolve(process.cwd(), name);
    fs.unlink(filePath, (err) => {
        if (err) {
            return err;
        }
    });
};

const deleteImgs = (filenames) => {
    filenames.forEach((file) => {
        const filePath = path.resolve(process.cwd(), file);
        fs.unlink(filePath, (err) => {
            if (err) {
                return err;
            }
        });
    });
};

const uploadImg = (file) => {
    const matches = file.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
        return 'Invalid image data.';
    }

    const fileType = matches[1]; // Loại file (ví dụ: image/png, image/jpeg)
    const base64Data = matches[2]; // Dữ liệu ảnh đã mã hóa Base64

    const fileExtension = fileType.split('/')[1];
    const timestamp = Date.now();

    // Đường dẫn file
    const directoryPath = path.join(process.cwd(), 'src/public/imgs');

    const fileName = `${timestamp}.${fileExtension}`;
    const filePath = path.join(directoryPath, fileName);

    const bufferData = Buffer.from(base64Data, 'base64');

    // Lưu file ảnh
    fs.writeFileSync(filePath, bufferData, (err) => {
        if (err) {
            return err;
        }
    });
    return fileName;
};
const moveFile = (oldPath, newPath) => {
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return err;
        }
    });
};

export const uploadModel = {
    uploadImgs,
    deleteImg,
    deleteImgs,
    uploadImg,
    ensureDirExists,
    moveFile
};
