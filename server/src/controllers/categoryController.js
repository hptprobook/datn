/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { categoryModel } from '~/models/categoryModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModal } from '~/models/uploadModal';
import { createSlug } from '~/utils/createSlug';
const fs = require('fs');
const path = require('path');

const createCategory = async (req, res) => {
  try {
    const { name, description, parentId, content, status, image } = req.body;

    if (!name || !description || !parentId || !content || !status || !image) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const parentIdProcessed = parentId === 'null' ? null : parentId;

    let imageURL = '';

    if (image) {
      const matches = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return res.status(400).send('Invalid image data.');
      }

      const fileType = matches[1]; // Loại file (ví dụ: image/png, image/jpeg)
      const base64Data = matches[2]; // Dữ liệu ảnh đã mã hóa Base64

      const fileExtension = fileType.split('/')[1];
      const timestamp = Date.now();

      // Đường dẫn file
      const directoryPath = path.join(process.cwd(), 'src/public/imgs');

      const fileName = `${timestamp}.${fileExtension}`;
      const filePath = path.join(directoryPath, fileName);

      const bufferData = Buffer.from(base64Data, 'base64');

      // Lưu file ảnh
      fs.writeFileSync(filePath, bufferData, (err) => {
        if (err) {
          return res.status(500).send('Error saving image.');
        }
      });
      imageURL = fileName;
    } else {
      return res.status(400).send('No image provided.');
    }

    const slug = createSlug(name);

    const data = {
      name,
      slug,
      description,
      content,
      imageURL,
      parentId: parentIdProcessed,
      status,
    };

    const dataCategory = await categoryModel.createCategory(data);

    if (dataCategory.error) {
      await uploadModal.deleteImg(imageURL);
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
const update = async (req, res) => {
  const { id } = req.params;
  const { name, description, parentId, content, status, image } = req.body;

  if (!name || !description || !parentId || !content || !status || !image) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const category = await categoryModel.getCategoryById(id);
  let imageURL = '';

  if (image) {
    const matches = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return res.status(400).send('Invalid image data.');
    }

    const fileType = matches[1]; // Loại file (ví dụ: image/png, image/jpeg)
    const base64Data = matches[2]; // Dữ liệu ảnh đã mã hóa Base64

    const fileExtension = fileType.split('/')[1];
    const timestamp = Date.now();

    // Đường dẫn file
    const directoryPath = path.join(process.cwd(), 'src/public/imgs');

    const fileName = `${timestamp}.${fileExtension}`;
    const filePath = path.join(directoryPath, fileName);

    const bufferData = Buffer.from(base64Data, 'base64');

    // Lưu file ảnh
    fs.writeFileSync(filePath, bufferData, (err) => {
      if (err) {
        return res.status(500).send('Error saving image.');
      }
    });
    imageURL = fileName;
  } else {
    return res.status(400).send('No image provided.');
  }
  if (!category) {
    await uploadModal.deleteImg(imageURL);
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
    imageURL: imageURL,
    parentId: parentIdProcessed,
    status,
  };

  const dataCategory = await categoryModel.update(id, data);
  if (dataCategory.error) {
    await uploadModal.deleteImg(imageURL);
    return res.status(StatusCodes.BAD_REQUEST).json(dataCategory.detail);
  }
  await uploadModal.deleteImg(category.imageURL);
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
  update,
  deleteCategory,
  getCategoryById,
  getAllCategories,
  getCategoryBySlug,
};
