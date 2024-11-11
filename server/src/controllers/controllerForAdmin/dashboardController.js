import { StatusCodes } from 'http-status-codes';
import { dashboardModel } from '~/models/dashboardModel';
const userStatistics = async (req, res) => {
    try {
        const results = await dashboardModel.userStatistics();
        return res.status(StatusCodes.OK).json(results);
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        });
    }
}
export const dashboardController = {
    userStatistics
};