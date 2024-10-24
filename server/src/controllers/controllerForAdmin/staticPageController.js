
import { StatusCodes } from 'http-status-codes';
import { staticPagesModel } from '~/models/staticPagesModel';
import { preCheckId } from '~/utils/helper';
const create = async (req, res) => {
    try {
        const data = req.body;
        const existingSlug = await staticPagesModel.getBy('slug', data.slug);
        if (existingSlug) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Slug đã tồn tại!',
            });
        }
        const existingType = await staticPagesModel.getBy('type', data.type);
        if (existingType) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Loại trang đã tồn tại!',
            });
        }
        const result = await staticPagesModel.create(data);
        return res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error,
        });
    }
}
const getBy = async (req, res) => {
    try {
        const { by } = req.query;
        const { value } = req.params;
        if (by !== '_id' && by !== 'slug' && by !== 'type') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thông tin không hợp lệ!',
            });
        }
        const result = await staticPagesModel.getBy(by, value);
        return res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error,
        });
    }
}
const gets = async (req, res) => {
    try {
        const result = await staticPagesModel.gets();
        return res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error,
        });
    }
}
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const existingSlug = await staticPagesModel.getBy('slug', data.slug);
        if (existingSlug && existingSlug._id.toString() !== id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Slug đã tồn tại!',
            });
        }
        const existingType = await staticPagesModel.getBy('type', data.type);
        if (existingType && existingType._id.toString() !== id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Loại trang đã tồn tại!',
            });
        }
        const result = await staticPagesModel.update(id, data);
        return res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error,
        });
    }
}
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const check = preCheckId(id);
        if (!check) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Id không hợp lệ!',
            });
        }
        const existing = await staticPagesModel.getBy('_id', id);
        if (!existing) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Trang không tồn tại!',
            });
        }
        const result = await staticPagesModel.remove(id);
        return res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error,
        });
    }
}
export const staticPageController = {
    create,
    getBy,
    gets,
    update,
    remove
}