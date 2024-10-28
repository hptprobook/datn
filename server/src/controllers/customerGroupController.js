/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { customerGroupModel } from '~/models/customerGroupModel';
import { v4 as uuidv4 } from 'uuid';
const getAllCG = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const blogs = await customerGroupModel.getAllCG(page, limit);
        return res.status(StatusCodes.OK).json(blogs);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json('Có lỗi xảy ra xin thử lại sau');
    }
};
const findByStatus = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const { status } = req.params;

        const blogs = await customerGroupModel.findBlogByStatus(
            status,
            page,
            limit
        );
        return res.status(StatusCodes.OK).json(blogs);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json('Có lỗi xảy ra xin thử lại sau');
    }
};

const findOneCG = async (req, res) => {
    try {
        const { idCG } = req.params;
        const result = await customerGroupModel.findOneCG(idCG);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json('Có lỗi xảy ra xin thử lại sau');
    }
};

const createCG = async (req, res) => {
    try {
        const { auto } = req.body;
        if (auto && auto.length > 0) {
            const newAuto = auto.map((i) => ({
                ...i,
                id: uuidv4(),
            }));
            const dataCG = { ...req.body, auto: newAuto };
            const result = await customerGroupModel.createCG(dataCG);
            if (result.acknowledged) {
                return res
                    .status(StatusCodes.CREATED)
                    .json({ message: 'Tạo nhóm khách hàng thành công', result });
            }
            return res.status(StatusCodes.BAD_REQUEST).json(result);
        }

        const dataCG = req.body;
        const result = await customerGroupModel.createCG(dataCG);
        if (result.acknowledged) {
            return res
                .status(StatusCodes.CREATED)
                .json({ message: 'Tạo nhóm khách hàng thành công', result });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(result);
    } catch (error) {
        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const updateCG = async (req, res) => {
    try {
        const { idCG } = req.params;
        const { auto } = req.body;
        if (auto && auto.length > 0) {
            const newAuto = auto.map((i) => ({
                ...i,
                id: uuidv4(),
            }));
            const dataCG = { ...req.body, auto: newAuto };
            const result = await customerGroupModel.updateCG(idCG, dataCG);
            return res.status(StatusCodes.OK).json(result); // Changed to OK
        }

        const dataCG = req.body;
        const result = await customerGroupModel.updateCG(idCG, dataCG);
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

const adCustomerCG = async (req, res) => {
    try {
        const { idCG } = req.params;
        const dataCustomerCG = req.body;
        const result = await customerGroupModel.addUsersCG(
            idCG,
            dataCustomerCG
        );
        if (result) {
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Thêm khách hàng thành công' });
        }
    } catch (error) {
        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};
const removeUserCG = async (req, res) => {
    try {
        const { idCG } = req.params;
        const dataCustomerCG = req.body;
        const result = await customerGroupModel.delCustomers(
            idCG,
            dataCustomerCG
        );
        if (result.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Xóa danh sách khách hàng thành công' });
        }
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

const removeOneUserCG = async (req, res) => {
    try {
        const { idCG } = req.params;
        const { idUser } = req.body;
        console.log('Received idCG:', idCG);
        console.log('Received idUser:', idUser);
        const result = await customerGroupModel.delOnceCustomer(idCG, idUser);
        if (result.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Xóa khách hàng thành công' });
        }
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

const deleteCG = async (req, res) => {
    try {
        const { idCG } = req.params;
        const result = await customerGroupModel.deleteCG(idCG);
        if (result.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Xoá dữ liệu nhóm khách hàng thành công' });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(result);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
    }
};

export const customerGroupController = {
    createCG,
    getAllCG,
    updateCG,
    deleteCG,
    findOneCG,
    adCustomerCG,
    removeUserCG,
    removeOneUserCG,
};
