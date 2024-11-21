/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { categoryModel } from '~/models/categoryModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModel } from '~/models/uploadModel';
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
    data.seoOption = JSON.parse(data.seoOption);
    const category = await categoryModel.getCategoryBySlug(data.slug);

    if (category) {
      uploadModel.deleteImg(filePath);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Danh mục đã tồn tại',
      });
    }

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

const increaseViews = async (req, res) => {
  try {
    const { slug } = req.params;

    const categories = await categoryModel.increaseViewBySlug(slug);

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

const getCategoryByViews = async (req, res) => {
  try {
    const categories = await categoryModel.getCategoryByViews();

    return res.status(StatusCodes.OK).json(categories);
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
    if (typeof data.seoOption === 'string') {
      data.seoOption = JSON.parse(data.seoOption);
    }
    if (!req.file) {
      const category = await categoryModel.getCategoryById(id);

      if (!category) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Danh mục chưa được tạo' });
      }
      const result = await categoryModel.update(id, data);

      return res.status(StatusCodes.OK).json(result);
    }

    const file = req.file;
    const fileName = file.filename;
    const filePath = path.join('uploads/categories', fileName);

    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      uploadModel.deleteImg(filePath);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Danh mục chưa được tạo' });
    }

    if (data.slug && data.slug !== category.slug) {
      const existingCategory = await categoryModel.getCategoryBySlug(data.slug);
      if (existingCategory) {
        uploadModel.deleteImg(filePath);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Danh mục đã tồn tại',
        });
      }
    }
    data.imageURL = filePath;

    const dataCategory = await categoryModel.update(id, data);
    uploadModel.deleteImg(category.imageURL);
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

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Danh mục không tồn tại' });
    }
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
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteManyCategory = async (req, res) => {
  try {
    const { ids } = req.body;

    const { images, failedIds, deletedIds } =
      await categoryModel.deleteManyCategories(ids);

    uploadModel.deleteImgs(images);

    return res.status(StatusCodes.OK).json({
      message: 'Xóa thành công',
      deletedIds,
      failedIds,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
const creates = async (req, res) => {
  try {
    const data = req.body;
    const errors = [];
    const successful = [];
    for (const w of data) {
      try {
        if (w._id) {
          const existed = await categoryModel.getCategoryById(
            w._id
          );
          if (!existed) {
            errors.push({
              message: `Danh mục với id: ${w._id} không tồn tại`,
            });
            continue;
          }
          const id = w._id;
          delete w._id;
          const existedSlug = await categoryModel.getCategoryBySlug(w.slug);
          if (existedSlug && existedSlug._id.toString() !== id) {
            errors.push({
              message: `Slug: ${w.slug} đã tồn tại`,
            });
            continue;
          }
          w.seoOption = existed.seoOption;
          await categoryModel.update(
            id,
            w
          );
          successful.push({
            message: 'Cập nhật thành công danh mục: ' + w.name + ' với id: ' + id,
          });
          if (w.imageURL && existed.imageURL !== w.imageURL) {
            await uploadModel.deleteImg(existed.imageURL);
          }
        }
        else {
          const existedSlug = await categoryModel.getCategoryBySlug(w.slug);
          if (existedSlug) {
            errors.push({
              message: `Slug: ${w.slug} đã tồn tại`,
            });
            continue;
          }
          w.seoOption = {
            title: w.name,
            description: w.name,
            alias: w.slug,
          }
          await categoryModel.createCategory(w);
          successful.push({
            message: 'Tạo mới thành công danh mục: ' + w.name,
          });
        }

      } catch (error) {
        errors.push({
          message: error.details
            ? (w.name + ': ' + error.details[0].message)
            : (error.message || 'Có lỗi xảy ra khi thêm danh mục'),
        });
      }
    }

    // Trả về kết quả
    if (errors.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Một số danh mục không thể thêm được',
        errors,
        successful,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: 'Tất cả đã được thêm thành công',
      successful,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra, xin thử lại sau',
    });
  }
};
export const categoryController = {
  getMenuCategories,
  createCategory,
  update,
  increaseViews,
  getCategoryByViews,
  deleteCategory,
  getCategoryById,
  getAllCategories,
  getCategoryBySlug,
  deleteManyCategory,
  creates,
};
