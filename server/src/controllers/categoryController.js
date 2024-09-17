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
    const { name, description, parentId, content, status } = req.body;

    if (!name || !description || !parentId || !content || !status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const parentIdProcessed = parentId === 'null' ? null : parentId;

    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ mgs: 'Ảnh không được để trống' });
    }
    const file = req.file;
    const fileName = file.filename;
    const filePath = path.join('uploads/categories', fileName);
    const slug = createSlug(name);

    const data = {
      name,
      slug,
      description,
      content,
      imageURL: filePath,
      parentId: parentIdProcessed,
      status,
    };

    const dataCategory = await categoryModel.createCategory(data);

    if (dataCategory.error) {
      await uploadModel.deleteImg(filePath);
      return res.status(StatusCodes.BAD_REQUEST).json(dataCategory.detail);
    }
    return res
      .status(StatusCodes.OK)
      .json({ dataCategory, mgs: 'Thêm danh mục thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getCategoryHierarchy = async (parentId = 'ROOT') => {
  const categories = await categoryModel.getCategoriesByParentId(parentId);

  const menu = await Promise.all(
    categories.map(async (cat) => {
      const subCategories = await getCategoryHierarchy(cat._id.toString());
      const category = {
        id: cat._id,
        title: cat.name,
        slug: cat.slug,
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
    const countCategories = await categoryModel.countCategoryAll();
    const categories = await categoryModel.getCategoriesAll();

    return res.status(StatusCodes.OK).json({
      categories,
      countCategories,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
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
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.getCategoryById(id);

    if (category) {
      return res.status(StatusCodes.OK).json({
        category,
      });
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại danh mục' });
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

    if (category) {
      return res.status(StatusCodes.OK).json({
        category,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại danh mục' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, description, parentId, content, status } = req.body;

  if (!name || !description || !parentId || !content || !status) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const category = await categoryModel.getCategoryById(id);
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ mgs: 'Ảnh không được để trống' });
  }
  const file = req.file;
  const fileName = file.filename;
  const filePath = path.join('uploads/categories', fileName);

  if (!category) {
    await uploadModel.deleteImg(filePath);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ mgs: 'Danh mục chưa được tạo' });
  }
  const slug = createSlug(name);
  const parentIdProcessed = parentId === 'null' ? null : parentId;

  const data = {
    name,
    slug,
    description,
    content,
    imageURL: filePath,
    parentId: parentIdProcessed,
    status,
  };

  const dataCategory = await categoryModel.update(id, data);
  if (dataCategory.error) {
    await uploadModel.deleteImg(filePath);
    return res.status(StatusCodes.BAD_REQUEST).json(dataCategory.detail);
  }
  await uploadModel.deleteImg(category.imageURL);
  return res
    .status(StatusCodes.OK)
    .json({ dataCategory, mgs: 'Cập nhật danh mục thành công' });
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
      await uploadModel.deleteImg(dataCategory.imageURL);
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
