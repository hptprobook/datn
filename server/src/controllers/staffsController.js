
import { staffsModel } from '../models/staffsModel';

const createStaff = async (req, res) => {
    try {
        const data = req.body;
        const result = await staffsModel.createStaff(data);
        res.status(200).json({
            status: 'success',
            data: result.ops[0],
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
}
export const staffsController = {
    createStaff,
}