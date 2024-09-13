/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { categoryModel } from '~/models/categoryModel';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModal } from '~/models/uploadModal';
import { createSlug } from '~/utils/createSlug';

const createCategory = async (req, res) => {
  try {
    const { name, description, parentId } = req.body;

    if (!name || !description || !parentId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const file = req.file;
    const fileName = file ? file.filename : '';

    /*     const validParentId =
      parentId === null || parentId === undefined
        ? null
        : new ObjectId(parentId); */
    const slug = createSlug(name);
    const data = {
      name,
      imageURL: fileName,
      description,
      slug,
      parentId: parentId,
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
    console.error(error);
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
    console.error(error);
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

  const validParentId = parentId === null ? null : new ObjectId(parentId);

  const data = {
    name,
    imageURL: fileName,
    description,
    slug,
    parentId: validParentId,
  };

  const dataCategory = await categoryModel.update(id, data);
  if (dataCategory?.error) {
    await uploadModal.deleteImg(fileName);
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
    if (dataCategory.imageURL) {
      await uploadModal.deleteImg(dataCategory.imageURL);
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa danh mục thành công' });
  }
};

export const categoryController = {
  getMenuCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
  getCategoryBySlug,
};
