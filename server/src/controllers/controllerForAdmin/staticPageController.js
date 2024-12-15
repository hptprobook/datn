
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
const deletes = async (req, res) => {
    try {
        const { ids } = req.body;
        const errors = [];
        const successful = [];
        for (const id of ids) {
            try {
                const check = preCheckId(id);
                if (!check) {
                    errors.push({

                        message: `Id: ${id} không hợp lệ`,
                    });
                    continue;
                }
                const existed = await staticPagesModel.getBy('_id', id);
                if (!existed) {
                    errors.push({
                        message: `Trang tĩnh với id: ${id} không tồn tại`,
                    });
                    continue;
                }
                await staticPagesModel.remove(id);
                successful.push({
                    message: 'Xóa thành công trang tĩnh với id: ' + id,
                });
            } catch (error) {
                errors.push({
                    message: error.message || 'Có lỗi xảy ra khi xóa trang tĩnh',
                });
            }
        }
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Một số trang tĩnh không thể xóa được',
                errors,
                successful,
            });
        }
        return res.status(StatusCodes.OK).json({
            message: 'Tất cả đã được xóa thành công',
            successful,
        });
    } catch (error) {

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Có lỗi xảy ra, xin thử lại sau',
        });
    }
};


const creates = async (req, res) => {
    try {
        const data = req.body;
        const errors = [];
        const successful = [];
        for (const w of data) {
            try {
                if (w._id) {
                    const existed = await staticPagesModel.getBy(
                        '_id',
                        w._id
                    );
                    if (!existed) {
                        errors.push({
                            message: `Trang tĩnh với id: ${w._id} không tồn tại`,
                        });
                        continue;
                    }
                    const id = w._id;
                    delete w._id;
                    const existedSlug = await staticPagesModel.getBy('slug', w.slug);
                    if (existedSlug && existedSlug._id.toString() !== id) {
                        errors.push({
                            message: `Slug: ${w.slug} đã tồn tại`,
                        });
                        continue;
                    }
                    await staticPagesModel.update(
                        id,
                        w
                    );
                    successful.push({
                        message: 'Cập nhật thành công trang tĩnh: ' + w.title + ' với id: ' + id,
                    });

                }
                else {
                    const existedSlug = await staticPagesModel.getBy('slug', w.slug);
                    if (existedSlug) {
                        errors.push({
                            message: `Slug: ${w.slug} đã tồn tại`,
                        });
                        continue;
                    }
                    await staticPagesModel.create(w);
                    successful.push({
                        message: 'Tạo mới thành công trang tĩnh: ' + w.title,
                    });
                }

            } catch (error) {
                errors.push({
                    message: error.details
                        ? (w.title + ': ' + error.details[0].message)
                        : (error.message || 'Có lỗi xảy ra khi thêm trang tĩnh'),
                });
            }
        }

        // Trả về kết quả
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Một số trang tĩnh không thể thêm được',
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
export const staticPageController = {
    create,
    getBy,
    gets,
    update,
    remove,
    creates,
    deletes,
}