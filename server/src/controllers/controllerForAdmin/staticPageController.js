
import { StatusCodes } from 'http-status-codes';
import { staticPagesModel } from '~/models/staticPagesModel';
const create = async (req, res) => {
    try {
        const data = req.body;
        const result = await staticPagesModel.create(data);
        return res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error,
        });
    }
}
export const staticPageController = {
    create
}