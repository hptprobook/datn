
import { StatusCodes } from 'http-status-codes';
import { navDashboardModel } from '~/models/navModel';
import { cathError } from '../cathErrorValidate';

const createdNavDashboard = async (req, res) => {
    try {
        const data = req.body;
        const result = await navDashboardModel.createdNavDashboard(data);
        if (result) {
            return res.status(StatusCodes.OK).json(result);
        }
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Tạo thất bại' });
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

export const navDashboardController = {
    createdNavDashboard,
    getNavDashboard
};