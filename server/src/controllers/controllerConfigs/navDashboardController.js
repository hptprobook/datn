
import { StatusCodes } from 'http-status-codes';
import { navDashboardModel } from '~/models/navModel';
import { cathError } from '../cathErrorValidate';

const createdNavDashboard = async (req, res) => {
    try {
        const data = req.body;
        const result = await navDashboardModel.createdNavDashboard(data);
        if (result.error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: result.error });
        }
        return res.status(StatusCodes.OK).json(result);

    }
    catch (error) {
        const errorSend = cathError(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: errorSend,
        });
    }
};
const getNavDashboard = async (req, res) => {
    try {
        const result = await navDashboardModel.getNavDashboard();
        if (result) {
            return res.status(StatusCodes.OK).json(result);
        }
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Không có dữ liệu' });
    }
    catch (error) {
        const errorSend = cathError(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: errorSend,
        });
    }
}
const removeNavDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await navDashboardModel.removeNavDashboard(id);
        if (result.error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: result.error });
        } else {
            return res.status(StatusCodes.OK).json(result);
        }
    }
    catch (error) {
        const errorSend = cathError(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: errorSend,
        });
    }
}
const updateNavDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await navDashboardModel.updateNavDashboard(id, data);
        if (result.error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: result.error });
        }
        return res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error,
        });
    }
}
export const navDashboardController = {
    createdNavDashboard,
    getNavDashboard,
    removeNavDashboard,
    updateNavDashboard,
};