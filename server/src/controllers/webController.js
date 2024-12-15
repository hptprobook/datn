/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
// import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { webModel } from '~/models/webModel';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';
import { redisUtils } from '~/utils/redis';
const getWeb = async (req, res) => {
  try {
    const cacheKey = 'web:settings';

    // Kiểm tra cache
    const cachedData = await redisUtils.getCache(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json(cachedData);
    }

    // Truy vấn từ database
    const web = await webModel.getWeb();

    // Lưu kết quả vào cache với TTL (ví dụ 1 giờ)
    if (web) {
      await redisUtils.setCache(cacheKey, web, 3600); // TTL 1 giờ
    }

    return res.status(StatusCodes.OK).json(web);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const updateWeb = async (req, res) => {
  try {
    const staff = req.user;
    const data = req.body;
    const logo = req.files?.logo ? req.files.logo[0] : null;
    const icon = req.files?.icon ? req.files.icon[0] : null;
    const darkLogo = req.files?.darkLogo ? req.files.darkLogo[0] : null;
    const eventBanner = req.files?.eventBanner
      ? req.files.eventBanner[0]
      : null;
    const loginScreen = req.files?.loginScreen
      ? req.files.loginScreen[0]
      : null;
    if (logo) {
      const fileName = logo.filename;
      const filePath = path.join('uploads/web', fileName);
      data.logo = filePath;
    }
    if (icon) {
      const fileName = icon.filename;
      const filePath = path.join('uploads/web', fileName);
      data.icon = filePath;
    }
    if (darkLogo) {
      const fileName = darkLogo.filename;
      const filePath = path.join('uploads/web', fileName);
      data.darkLogo = filePath;
    }
    if (eventBanner) {
      const fileName = eventBanner.filename;
      const filePath = path.join('uploads/web', fileName);
      data.eventBanner = filePath;
    }
    if (loginScreen) {
      const fileName = loginScreen.filename;
      const filePath = path.join('uploads/web', fileName);
      data.loginScreen = filePath;
    }
    if (
      staff.role !== 'root' &&
      (data.nameBank || data.numberBank || data.nameholderBank)
    ) {
      if (logo) {
        await uploadModel.deleteImg(logo.filename);
      }
      if (darkLogo) {
        await uploadModel.deleteImg(darkLogo.filename);
      }
      if (icon) {
        await uploadModel.deleteImg(icon.filename);
      }
      if (eventBanner) {
        await uploadModel.deleteImg(eventBanner.filename);
      }
      if (loginScreen) {
        await uploadModel.deleteImg(loginScreen.filename);
      }
      return res.status(StatusCodes.FORBIDDEN).json({
        messages: 'Bạn không có quyền thực hiện chức năng này',
      });
    }
    const web = await webModel.getWeb();
    if (!web) {
      const result = await webModel.createWeb(data);
      return res.status(StatusCodes.OK).json(result);
    }
    const id = web._id.toString();

    if (!req.files) {
      const dataSeo = req.body;
      const result = await webModel.updateWeb(id, dataSeo);
      return res.status(StatusCodes.OK).json(result);
    }
    const result = await webModel.updateWeb(id, data);
    if (result) {
      if (logo) {
        await uploadModel.deleteImg(web.logo);
      }
      if (darkLogo) {
        await uploadModel.deleteImg(web.darkLogo);
      }
      if (eventBanner) {
        await uploadModel.deleteImg(web.eventBanner);
      }
      if (loginScreen) {
        await uploadModel.deleteImg(web.loginScreen);
      }
      if (icon) {
        await uploadModel.deleteImg(icon.filename);
      }
    }

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const logo = req.files?.logo ? req.files.logo[0] : null;
    const darkLogo = req.files?.darkLogo ? req.files.darkLogo[0] : null;
    const eventBanner = req.files?.eventBanner
      ? req.files.eventBanner[0]
      : null;
    const loginScreen = req.files?.loginScreen
      ? req.files.loginScreen[0]
      : null;
    const icon = req.files?.icon ? req.files.icon[0] : null;
    if (icon) {
      await uploadModel.deleteImg(icon.filename);
    }
    if (loginScreen) {
      await uploadModel.deleteImg(loginScreen.filename);
    }
    if (logo) {
      await uploadModel.deleteImg(logo.filename);
    }
    if (darkLogo) {
      await uploadModel.deleteImg(darkLogo.filename);
    }
    if (eventBanner) {
      await uploadModel.deleteImg(eventBanner.filename);
    }
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

export const webController = {
  getWeb,
  updateWeb,
};
