/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { categoryModel } from '~/models/categoryModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { ObjectId } from 'mongodb';

const createCategory = async (req, res) => {
  const { name, imageURL, description, slug, parentId } = req.body;
  if (!name && !imageURL && !description && !slug && !parentId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const data = {
    name,
    imageURL,
    description,
    slug,
    parentId: parentId,
  };
  const dataCategory = await categoryModel.createCategory(data);

  return res.status(StatusCodes.OK).json({ dataCategory });
};

const getAllCategories = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const category = await categoryModel.getCategoriesAll(pages, limit);
    const countCategories = await categoryModel.countCategoryAll();
    return res.status(StatusCodes.OK).json({
      category,
      countCategories,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const dataCategory = await categoryModel.update(id, data);
  if (dataCategory?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataCategory) {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Cập nhật thông tin thành công', dataCategory });
  }
};
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const dataCategory = await categoryModel.deleteCategory(id);
  if (dataCategory?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataCategory) {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa danh mục thành công' });
  }
};

export const categoryController = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
