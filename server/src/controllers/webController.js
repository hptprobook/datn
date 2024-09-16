/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
// import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModal } from '~/models/uploadModal';
import { webModel } from '~/models/webModel';
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
            await uploadModal.deleteImg(req.file.filename);
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
        await uploadModal.deleteImg(req.file.filename);
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
                .json({ mgs: 'Dữ liệu Web chưa được tạo' });
        }
        const id = web._id.toString();
        if (!req.file) {
            const dataSeo = req.body;
            const result = await webModel.updateWeb(id, dataSeo);
            return res
                .status(StatusCodes.OK)
                .json(result);
        }
        const dataSeo = {
            ...req.body,
            logo: req.file.filename,
        };
        const result = await webModel.updateWeb(id, dataSeo);
        if (result.error) {
            if (req.file) {
                await uploadModal.deleteImg(req.file.filename);
            }
            return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
        }
        if (req.file) {
            await uploadModal.deleteImg(web.logo);
        }
        return res
            .status(StatusCodes.OK)
            .json(result);
    } catch (error) {
        if (req.file) {
            await uploadModal.deleteImg(req.file.filename);
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
//         await uploadModal.deleteImg(seo.metaOGImg);
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