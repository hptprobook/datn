import fs from 'fs';
import path, { join } from 'path';
import { StatusCodes } from 'http-status-codes';
import { uploadModel } from '~/models/uploadModel';


const handleGetFiles = (directoryPath, limit = 10, folder) => {
    try {
        const items = fs.readdirSync(directoryPath, { withFileTypes: true });
        const files = [];

        let count = 0; // Biến đếm số tệp đã lấy được

        items.forEach(item => {
            if (item.isFile() && count < limit) {
                files.push(path.join('uploads', folder, item.name)); // Lưu tên file
                count++; // Tăng biến đếm
            }
        });

        return files; // Trả về danh sách file, giới hạn bởi tham số limit
    } catch (err) {
        return []; // Trả về mảng trống nếu có lỗi
    }
};

const handleGetFolders = (directoryPath) => {
    try {
        const items = fs.readdirSync(directoryPath, { withFileTypes: true });
        const folders = [];

        items.forEach(item => {
            if (item.isDirectory()) {
                folders.push(item.name); // Lưu tên thư mục
            }
        });

        return folders; // Trả về danh sách thư mục
    } catch (err) {
        return []; // Trả về mảng trống nếu có lỗi
    }
};


const getFolder = (req, res) => {
    try {
        let uploadsPath = path.join(__dirname, '../../../uploads');
        const result = handleGetFolders(uploadsPath);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getFiles = (req, res) => {
    try {
        const { folder } = req.params;
        const { limit } = req.query;
        const uploadsPath = path.join(__dirname, '../../../uploads', folder);

        const result = handleGetFiles(uploadsPath, limit, folder);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteFile = async (req, res) => {
    try {
        const { name } = req.body;
        await uploadModel.deleteImg(name);
        res.status(StatusCodes.OK).json({ message: 'Xóa file thành công' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const { folder } = req.body;
        const destinationFolder = path.join(process.cwd(), 'uploads', folder);

        await uploadModel.ensureDirExists(destinationFolder);
        const newFilePath = path.join(destinationFolder, file.filename);

        await uploadModel.moveFile(file.path, newFilePath);

        res.json({
            message: 'Upload file thành công',
            file: newFilePath
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const fileManagerController = {
    getFolder,
    getFiles,
    deleteFile,
    uploadFile
};