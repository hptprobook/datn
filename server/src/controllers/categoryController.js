/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { categoryModel } from '~/models/categoryModel';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModal } from '~/models/uploadModal';

const createCategory = async (req, res) => {
  try {
    const { name, description, slug, parentId } = req.body;

    if (!name || !description || !slug || !parentId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const file = req.file;
    const fileName = file ? file.filename : '1';

    const validParentId =
      parentId === 'null' || parentId === null ? null : new ObjectId(parentId);

    const data = {
      name,
      imageURL: fileName,
      description,
      slug,
      parentId: validParentId,
    };

    const dataCategory = await categoryModel.createCategory(data);

    return res.status(StatusCodes.OK).json({ dataCategory });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
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
  const { name, description, slug, parentId } = req.body;

  if (!name || !description || !slug || !parentId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const file = req.file;
  const fileName = file.filename;

  const validParentId =
    parentId === 'null' || parentId === null ? null : new ObjectId(parentId);

  const data = {
    name,
    imageURL: fileName,
    description,
    slug,
    parentId: validParentId,
  };

  const dataCategory = await categoryModel.update(id, data);
  if (dataCategory?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataCategory) {
    await uploadModal.deleteImg(dataCategory.imageURL);
    const result = dataCategory.result;
    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật thông tin thành công',
      dataCategory: result,
    });
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
    await uploadModal.deleteImg(dataCategory);
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
