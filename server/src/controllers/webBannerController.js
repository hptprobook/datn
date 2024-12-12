/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { webBannerModel } from '~/models/webBannerModel';
import { StatusCodes } from 'http-status-codes';
import { uploadModel } from '~/models/uploadModel';
import path from 'path';
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
            image: path.join('uploads/webBanner', req.file.filename),
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
            image: path.join('uploads/webBanner', req.file.filename),
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

const getWebBannerById = async (req, res) => {
    try {
        const { webBannerID } = req.params;
        const result = await webBannerModel.findWebBannerByID(webBannerID);
        if (!result) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Dữ liệu Web banner không tồn tại' });
        }
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
    }
};
const createManyBanner = async (req, res) => {
    try {
        const webs = req.body;
        const errors = [];
        const successful = [];
        for (const w of webs) {
            try {
                if (w._id) {
                    const existingVariant = await webBannerModel.findWebBannerByID(
                        w._id
                    );
                    if (!existingVariant) {
                        errors.push({
                            name: w.title,
                            message: 'Banner không tồn tại',
                        });
                        continue;
                    }
                    const id = w._id;
                    delete w._id;
                    const u = await webBannerModel.updateWebBanner(
                        id,
                        w
                    );
                    successful.push({
                        message: 'Cập nhật thành công Banner: ' + u.title,
                    });
                }
                else {
                    const result = await webBannerModel.createWebBanner(w);
                    successful.push({
                        message: 'Tạo mới thành công Banner: ' + w.title,
                    });
                }

            } catch (error) {
                // Lưu lại lỗi nếu có lỗi xảy ra với biến thể hiện tại
                console.log(error);
                errors.push({
                    name: w.title,
                    message: error.details
                        ? error.details[0].message
                        : 'Có lỗi xảy ra khi thêm banner',
                });
            }
        }

        // Trả về kết quả
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Một số banner khuyến mãi không thể thêm được',
                errors,
                successful,
            });
        }

        return res.status(StatusCodes.OK).json({
            message: 'Tất cả đã được thêm thành công',
            successful,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Có lỗi xảy ra, xin thử lại sau',
        });
    }
};
export const webBannerController = {
    createWebBanner,
    getwebBanner,
    updateWebBanner,
    deleteWebBanner,
    getWebBannerById,
    createManyBanner
};
