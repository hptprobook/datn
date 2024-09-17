/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { seoConfigModel } from '~/models/seoConfigModel';
import { StatusCodes } from 'http-status-codes';
// import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModal } from '~/models/uploadModel';
const getSeoConfig = async (req, res) => {
  try {
    const seo = await seoConfigModel.getSeoConfig();
    return res.status(StatusCodes.OK).json(seo);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const createSeoConfig = async (req, res) => {
  try {
    const seo = await seoConfigModel.getSeoConfig();
    if (seo) {
      await uploadModal.deleteImg(req.file.filename);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Dữ liệu SEO web đã được tạo' });
    }
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Img is not empty' });
    }
    const dataSeo = {
      ...req.body,
      metaOGImg: req.file.filename,
    };
    const result = await seoConfigModel.createSeo(dataSeo);
    if (result.acknowledged) {
      return res
        .status(StatusCodes.OK)
        .json({ mgs: 'Tạo dữ liệu SEO web thành công' });
    }
    await uploadModal.deleteImg(req.file.filename);
    return res.status(StatusCodes.BAD_REQUEST).json(result);
  } catch (error) {
    await uploadModal.deleteImg(req.file.filename);
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateSeoConfig = async (req, res) => {
  try {
    const seo = await seoConfigModel.getSeoConfig();
    if (!seo) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Dữ liệu SEO web chưa được tạo' });
    }
    const { id } = seo._id;
    if (!req.file) {
      const dataSeo = req.body;
      const result = await seoConfigModel.updateSeo(id, dataSeo);
      return res.status(StatusCodes.OK).json(result);
    }
    const dataSeo = {
      ...req.body,
      metaOGImg: req.file.filename,
    };
    const result = await seoConfigModel.updateSeo(id, dataSeo);
    if (result.error) {
      await uploadModal.deleteImg(req.file.filename);
      return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
    }
    await uploadModal.deleteImg(seo.metaOGImg);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
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
//     const seo = await seoConfigModel.getSeoConfig();
//     if (!seo) {
//         return res
//             .status(StatusCodes.BAD_REQUEST)
//             .json({ mgs: 'Dữ liệu SEO web chưa được tạo' });
//     }
//     const dataDel = await seoConfigModel.deleteSeoConfig(id);
//     if (dataDel.acknowledged) {
//         await uploadModal.deleteImg(seo.metaOGImg);
//         return res
//             .status(StatusCodes.OK)
//             .json({ mgs: 'Xoá dữ liệu SEO web thành công' });
//     }
//     return res.status(StatusCodes.BAD_REQUEST).json({ dataDel });
// };

export const seoConfigController = {
  createSeoConfig,
  getSeoConfig,
  updateSeoConfig,
  // deleteSeoConfig,
};
