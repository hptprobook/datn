/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { uploadModel } from '~/models/uploadModel';
import { blogModel } from '~/models/blogModel';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const getAllBlogs = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const blogs = await blogModel.getAllBlogs(page, limit);
    return res.status(StatusCodes.OK).json(blogs);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getTopViewBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.getTopViewBlogs();
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

    const blogs = await blogModel.findBlogByStatus(status, page, limit);
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
    const blog = await blogModel.findBlogByID(blogID);
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
    const blogs = await blogModel.findBlogAuthID(authID, page, limit);
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
    const blog = await blogModel.findBlogBySlug(slug);
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
    const blog = await blogModel.findBlogByTitle(title, page, limit);
    return res.status(StatusCodes.OK).json(blog);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const createBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu hình ảnh Thumbnail' });
    }
    const dataBlog = {
      ...req.body,
      thumbnail: path.join('uploads/blogs', req.file.filename),
    };
    const result = await blogModel.createBlog(dataBlog);
    if (result.acknowledged) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Thêm blog thành công' });
    }
    await uploadModel.deleteImg(path.join('uploads/blogs', req.file.filename));
    return res.status(StatusCodes.BAD_REQUEST).json(result);
  } catch (error) {
    if (req.file) {
      await uploadModel.deleteImg(
        path.join('uploads/blogs', req.file.filename)
      );
    }
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { blogID } = req.params;
    // Tìm dữ liệu từ id
    const blog = await blogModel.findBlogByID(blogID);
    // Nếu k update image
    if (!req.file) {
      const dataBlog = req.body;
      const result = await blogModel.updateBlog(blogID, dataBlog);
      return res.status(StatusCodes.OK).json(result);
    }
    // Nếu update image
    const dataBlog = {
      ...req.body,
      thumbnail: path.join('uploads/blogs', req.file.filename),
    };
    const result = await blogModel.updateBlog(blogID, dataBlog);
    if (result.error) {
      await uploadModel.deleteImg(
        path.join('uploads/blogs', req.file.filename)
      );
      return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
    }
    await uploadModel.deleteImg(blog.thumbnail);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    if (req.file) {
      await uploadModel.deleteImg(
        path.join('uploads/blogs', req.file.filename)
      );
    }
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateComment = async (req, res) => {
  try {
    const { blogID } = req.params;
    const commentId = uuidv4();
    const dataComment = { ...req.body, commentId };
    const result = await blogModel.updateComment(blogID, dataComment);
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
const delComment = async (req, res) => {
  try {
    const { blogID } = req.params;
    const { commentId } = req.body;
    const result = await blogModel.delComment(blogID, commentId);
    if (result.acknowledged) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Xóa comment thành công' });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(result);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateViews = async (req, res) => {
  try {
    const { blogID } = req.params;
    // Tìm dữ liệu từ id
    const result = await blogModel.updateViews(blogID);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { blogID } = req.params;
    const blog = await blogModel.findBlogByID(blogID);
    if (!blog) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Blog không tồn tại' });
    }
    const dataDel = await blogModel.deleteBlog(blogID);
    if (dataDel.acknowledged) {
      await uploadModel.deleteImg(blog.thumbnail);
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Xoá dữ liệu blog thành công' });
    }
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

export const blogController = {
  deleteBlog,
  createBlog,
  getAllBlogs,
  getTopViewBlogs,
  findBlogByID,
  updateBlog,
  updateViews,
  findBlogBySlug,
  findByStatus,
  findBlogByAuthID,
  updateComment,
  delComment,
  findBlogByTitle,
};
