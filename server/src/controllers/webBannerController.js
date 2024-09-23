/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { webBannerModel } from '~/models/webBannerModel';
import { StatusCodes } from 'http-status-codes';
import { uploadModel } from '~/models/uploadModel';
const getwebBanner = async (req, res) => {
    try {
        const banner = await webBannerModel.getWebBanner();
        return res.status(StatusCodes.OK).json(banner);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json('Có lỗi xảy ra xin thử lại sau');
    }
};

const createWebBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Thiếu hình ảnh banner' });
        }
        const dataWebBanner = {
            ...req.body,
            image: req.file.filename,
        };
        const result = await webBannerModel.createWebBanner(dataWebBanner);
        if (result.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ mgs: 'Thêm dữ liệu web banner thành công' });
        }
        await uploadModel.deleteImg(req.file.filename);
        return res.status(StatusCodes.BAD_REQUEST).json(result);
    } catch (error) {
        if (req.file) {
            await uploadModel.deleteImg(req.file.filename);
        }
        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const updateWebBanner = async (req, res) => {
    try {
        const { webBannerID } = req.params;
        // Tìm dữ liệu từ id
        const findOneWebBanner = await webBannerModel.findWebBannerByID(
            webBannerID
        );
        // Nếu k update image
        if (!req.file) {
            const dataWebBanner = req.body;
            const result = await webBannerModel.updateWebBanner(
                webBannerID,
                dataWebBanner
            );
            return res.status(StatusCodes.OK).json(result);
        }
        // Nếu update image
        const dataWebBanner = {
            ...req.body,
            image: req.file.filename,
        };
        const result = await webBannerModel.updateWebBanner(
            webBannerID,
            dataWebBanner
        );

        if (result.error) {
            await uploadModel.deleteImg(req.file.filename);
            return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
        }
        await uploadModel.deleteImg(findOneWebBanner.image);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (req.file) {
            await uploadModel.deleteImg(req.file.filename);
        }
        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const deleteWebBanner = async (req, res) => {
    try {
        const { webBannerID } = req.params;
        const findOneWebBanner = await webBannerModel.findWebBannerByID(
            webBannerID
        );
        if (!findOneWebBanner) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Dữ liệu Web banner không tồn tại' });
        }
        const dataDel = await webBannerModel.deleteWebBanner(webBannerID);
        if (dataDel.acknowledged) {
            await uploadModel.deleteImg(findOneWebBanner.image);
            return res
                .status(StatusCodes.OK)
                .json({ mgs: 'Xoá dữ liệu web banner thành công' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
    }
};

export const webBannerController = {
    createWebBanner,
    getwebBanner,
    updateWebBanner,
    deleteWebBanner,
};
