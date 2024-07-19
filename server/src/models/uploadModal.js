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
  const filePath = path.join('src/public/imgs', name);
  fs.unlink(filePath, (err) => {
    if (err) {
      return err;
    }
  });
};

const deleteImgs = (filenames) => {
  const deletedFilePaths = filenames.map((fileName) =>
    path.join('src/public/imgs', fileName)
  );
  deletedFilePaths.forEach((filePath) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return err;
      }
      fs.unlink(filePath, (error) => {
        if (error) {
          return err;
        }
      });
    });
  });
};

export const uploadModal = {
  uploadImgs,
  deleteImg,
  deleteImgs,
};
