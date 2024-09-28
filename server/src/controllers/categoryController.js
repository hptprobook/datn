/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { categoryModel } from '~/models/categoryModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModel } from '~/models/uploadModel';
import { createSlug } from '~/utils/createSlug';
import path from 'path';

const createCategory = async (req, res) => {
  try {
    const data = req.body;
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Ảnh không được để trống' });
    }
    const file = req.file;
    const fileName = file.filename;
    const filePath = path.join('uploads/categories', fileName);
    data.imageURL = filePath;
    const dataCategory = await categoryModel.createCategory(data);
    return res.status(StatusCodes.OK).json(dataCategory);
  } catch (error) {
    if (req.file) {
      uploadModel.deleteImg(req.file.path);
    }
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
    });
  }
};

const getCategoryHierarchy = async (parentId = 'ROOT', orderNumber = 0) => {
  const categories = await categoryModel.getCategoriesByParentId(parentId);
  let currentOrder = orderNumber;
  const menu = await Promise.all(
    categories.map(async (cat) => {
      const subCategories = await getCategoryHierarchy(
        cat._id.toString(),
        currentOrder + 1
      );
      const category = {
        id: cat._id,
        title: cat.name,
        slug: cat.slug,
        orderNumber: currentOrder,
      };

      if (subCategories.length > 0) {
        category.list = subCategories;
      }
      return category;
    })
  );
  return menu;
};

const getAllCategories = async (req, res) => {
  try {
    const query = req.query;
    if (query.parent) {
      const categories = await categoryModel.getCategoriesAll(query.parent);
      return res.status(StatusCodes.OK).json(categories);
    }
    const categories = await categoryModel.getCategoriesAll();
    return res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};

const getMenuCategories = async (req, res) => {
  try {
    const menu = await getCategoryHierarchy();

    return res.status(StatusCodes.OK).json({
      menu,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy danh mục!' });
    }
    return res.status(StatusCodes.OK).json(category);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.getCategoryBySlug(slug);

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy danh mục!' });
    }
    return res.status(StatusCodes.OK).json(category);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const update = async (req, res) => {
 try {
  const { id } = req.params;
  const data = req.body;
  const category = await categoryModel.getCategoryById(id);
  if (!category) {
    uploadModel.deleteImg(filePath);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Danh mục chưa được tạo' });
  }
  if (!req.file) {
    const result = await categoryModel.update(id, data);
    return res.status(StatusCodes.OK).json(result);
  }
  const file = req.file;
  const fileName = file.filename;
  const filePath = path.join('uploads/categories', fileName);
  data.imageURL = filePath;

  const dataCategory = await categoryModel.update(id, data);
  await uploadModel.deleteImg(category.imageURL);
  return res
    .status(StatusCodes.OK)
    .json(dataCategory);
 } catch (error) {
  if (req.file) {
    uploadModel.deleteImg(req.file.path);
  }
  if (error.details) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.details[0].message,
    });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Có lỗi xảy ra xin thử lại sau',
  });
 }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  await categoryModel.deleteAllChildCategories(id);
  const dataCategory = await categoryModel.deleteCategory(id);
  if (dataCategory?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataCategory) {
    if (dataCategory.imageURL) {
      uploadModel.deleteImg(dataCategory.imageURL);
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa danh mục thành công' });
  }
};

export const categoryController = {
  getMenuCategories,
  createCategory,
  update,
  deleteCategory,
  getCategoryById,
  getAllCategories,
  getCategoryBySlug,
};
