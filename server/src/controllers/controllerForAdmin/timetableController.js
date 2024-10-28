
import { createStaffToken } from '~/utils/helper';
import { staffsModel } from '~/models/staffsModel';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { timetableModel } from '~/models/timetableModel';
import { getDayName } from '~/utils/format';

const create = async (req, res) => {
    try {
        const data = req.body;
        const admin = req.user;
        // if (admin.branchId !== data.branchId && admin.role === 'admin') {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         message: 'Bạn không thể thêm lịch làm việc cho chi nhánh khác',
        //     });
        // }
        // const staff = await staffsModel.getStaffBy('_id', data.staffId);
        // if (!staff) {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         message: 'Nhân viên không tồn tại',
        //     });
        // }
        // if (staff.branchId !== data.branchId && admin.role === 'admin') {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         message: 'Nhân viên không thuộc chi nhánh này',
        //     });
        // }
        // kiểm tra ở đây
        data.date = new Date(data.date).setUTCHours(0, 0, 0, 0);
        data.startTime = new Date(data.startTime).getTime();
        data.endTime = new Date(data.endTime).getTime();
        if (data.endTime < data.startTime) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thời gian kết thúc không thể nhỏ hơn thời gian bắt đầu',
            });
        }
        const existTimetable = await timetableModel.existingTimetable(data);
        if (existTimetable) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Nhân viên đã có lịch làm việc trong thời gian này',
            });
        }
        const result = await timetableModel.create(data);
        res.status(StatusCodes.CREATED).json(result);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const findOneBy = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await timetableModel.findOneBy('_id', id);
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const findsBy = async (req, res) => {
    try {
        const { by, value } = req.params;
        const { grBy } = req.query;

        if (by === 'staffId' || by === 'branchId' || by === 'date' || by === 'status' || by === 'type') {
            if (!value) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Thiếu thông tin tìm kiếm',
                });
            }
        }
        else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Không thể tìm kiếm theo thông tin này',
            });
        }
        const result = await timetableModel.findsBy({
            by,
            value,
        });
        if (grBy === 'date') {
            const groupedByDate = result.reduce((acc, entry) => {
                const dateKey = new Date(entry.date).toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

                if (!acc[dateKey]) {
                    acc[dateKey] = []; // Create an array for this date if it doesn't exist
                }

                acc[dateKey].push(entry); // Push the current entry into the appropriate date group
                return acc;
            }, {});

            const groupedByDateArray = Object.keys(groupedByDate).map((date) => ({
                article: getDayName(date),
                date,
                timetables: groupedByDate[date],
                numberOfTimetables: groupedByDate[date].length,
            }));
            return res.status(StatusCodes.OK).json(groupedByDateArray);
        }
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const getAll = async (req, res) => {
    try {
        const { grBy } = req.query;
        const admin = req.user;
        let result;
        if (admin.role === 'admin') {
            result = await timetableModel.findsBy({
                by: 'branchId',
                value: admin.branchId,
            });
        }
        else {
            result = await timetableModel.findsBy({});
        }
        if (grBy === 'date') {
            const groupedByDate = result.reduce((acc, entry) => {
                const dateKey = new Date(entry.date).toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }

                acc[dateKey].push(entry); // Push the current entry into the appropriate date group
                return acc;
            }, {});

            const groupedByDateArray = Object.keys(groupedByDate).map((date) => ({
                article: getDayName(date),
                date,
                timetables: groupedByDate[date],
                numberOfTimetables: groupedByDate[date].length,
                brandId: admin.role === 'admin' ? admin.branchId : null,
            }));
            return res.status(StatusCodes.OK).json(groupedByDateArray);
        }
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
export const timetableController = {
    create,
    findOneBy,
    findsBy,
    getAll
}