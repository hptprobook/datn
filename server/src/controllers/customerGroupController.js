/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { customerGroupModel } from '~/models/CustomerGroupModel';
import { v4 as uuidv4 } from 'uuid';
const getAllBlogs = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const blogs = await customerGroupModel.getAllBlogs(page, limit);
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

const findBlogByID = async (req, res) => {
    try {
        const { blogID } = req.params;
        const blog = await customerGroupModel.findBlogByID(blogID);
        return res.status(StatusCodes.OK).json(blog);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json('Có lỗi xảy ra xin thử lại sau');
    }
};
const findBlogByAuthID = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const { authID } = req.params;
        const blogs = await customerGroupModel.findBlogAuthID(
            authID,
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
const findBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await customerGroupModel.findBlogBySlug(slug);
        return res.status(StatusCodes.OK).json(blog);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json('Có lỗi xảy ra xin thử lại sau');
    }
};
const findBlogByTitle = async (req, res) => {
    try {
        const { limit, page, title } = req.query;
        // const {} = req.body;
        if (!title) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Thiếu thông tin tiêu đề' });
        }
        const blog = await customerGroupModel.findBlogByTitle(
            title,
            page,
            limit
        );
        return res.status(StatusCodes.OK).json(blog);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json('Có lỗi xảy ra xin thử lại sau');
    }
};

const createCG = async (req, res) => {
    try {
        const dataCG = req.body;
        const result = await customerGroupModel.createCG(dataCG);
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

// const deleteBlog = async (req, res) => {
//     try {
//         const { blogID } = req.params;
//         const blog = await customerGroupModel.findBlogByID(blogID);
//         if (!blog) {
//             return res
//                 .status(StatusCodes.BAD_REQUEST)
//                 .json({ message: 'Blog không tồn tại' });
//         }
//         const dataDel = await customerGroupModel.deleteBlog(blogID);
//         if (dataDel.acknowledged) {
//             await uploadModel.deleteImg(blog.thumbnail);
//             return res
//                 .status(StatusCodes.OK)
//                 .json({ message: 'Xoá dữ liệu blog thành công' });
//         }
//     } catch (error) {
//         return res
//             .status(StatusCodes.BAD_REQUEST)
//             .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
//     }
// };

export const customerGroupController = {
    createCG,

    getAllBlogs,
    findBlogByID,
    findBlogBySlug,
    findByStatus,
    findBlogByAuthID,
    findBlogByTitle,
};
