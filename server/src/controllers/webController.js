/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
// import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { webModel } from '~/models/webModel';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';
const getWeb = async (req, res) => {
  try {
    const web = await webModel.getWeb();
    return res.status(StatusCodes.OK).json(web);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const createWeb = async (req, res) => {
  try {
    const Web = await webModel.getWeb();
    if (Web) {
      await uploadModel.deleteImg(req.file.filename);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Dữ liệu Web đã được tạo' });
    }
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Logo là bắt buộc' });
    }
    const dataWeb = {
      ...req.body,
      logo: req.file.filename,
    };
    const result = await webModel.createWeb(dataWeb);
    if (result.acknowledged) {
      return res
        .status(StatusCodes.OK)
        .json({ mgs: 'Tạo dữ liệu Web thành công' });
    }
    await uploadModel.deleteImg(req.file.filename);
    return res.status(StatusCodes.BAD_REQUEST).json(result);
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateWeb = async (req, res) => {
  try {
    const web = await webModel.getWeb();
    if (!web) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Dữ liệu Web chưa được tạo' });
    }
    const id = web._id.toString();
    if (!req.file) {
      const dataSeo = req.body;
      const result = await webModel.updateWeb(id, dataSeo);
      return res.status(StatusCodes.OK).json(result);
    }
    const file = req.file;
    const fileName = file.filename;
    const filePath = path.join('uploads/web', fileName);
    const dataSeo = {
      ...req.body,
      logo: filePath,
    };
    const result = await webModel.updateWeb(id, dataSeo);
    if (result.error) {
      if (req.file) {
        await uploadModel.deleteImg(filePath);
      }
      return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
    }
    if (req.file) {
      await uploadModel.deleteImg(web.logo);
    }
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const file = req.file;
    const fileName = file.filename;
    const filePath = path.join('uploads/web', fileName);
    if (req.file) {
      await uploadModel.deleteImg(filePath);
    }
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

// const deleteSeoConfig = async(req, res) => {
//     const { id } = req.params;
//     const seo = await webModel.getSeoConfig();
//     if (!seo) {
//         return res
//             .status(StatusCodes.BAD_REQUEST)
//             .json({ mgs: 'Dữ liệu SEO web chưa được tạo' });
//     }
//     const dataDel = await webModel.deleteSeoConfig(id);
//     if (dataDel.acknowledged) {
//         await uploadModel.deleteImg(seo.metaOGImg);
//         return res
//             .status(StatusCodes.OK)
//             .json({ mgs: 'Xoá dữ liệu SEO web thành công' });
//     }
//     return res.status(StatusCodes.BAD_REQUEST).json({ dataDel });
// };

export const webController = {
  createWeb,
  getWeb,
  updateWeb,
  // deleteSeoConfig,
};
