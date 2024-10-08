import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_CATEGORY_SCHEMA,
  UPDATE_CATEGORY,
} from '~/utils/schema/categorySchema';
import { uploadModal } from './uploadModel';

const validateBeforeCreate = async (data) => {
  return await SAVE_CATEGORY_SCHEMA.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_CATEGORY.validateAsync(data, { abortEarly: false });
};

const countCategoryAll = async () => {
  const db = await GET_DB().collection('categories');
  const total = await db.countDocuments();
  if (!total) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return total;
};

const getCategoriesAll = async (parent = null) => {
  if (parent) {
    const db = await GET_DB().collection('categories');
    const result = await db.find({ order: { $ne: 2 } }).toArray();
    if (!result) {
      throw new Error('Có lỗi xảy ra, xin thử lại sau');
    }
    return result;
  }
  const db = await GET_DB().collection('categories');
  const result = await db.find().sort({ createdAt: 1 }).toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const getCategoriesByParentId = async (category_id) => {
  const db = await GET_DB().collection('categories');
  const result = await db.find({ parentId: category_id }).toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const getCategoryById = async (category_id) => {
  const db = await GET_DB().collection('categories');
  const category = await db.findOne({ _id: new ObjectId(category_id) });
  if (!category) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return category;
};

const getCategoryBySlug = async (slug) => {
  const db = await GET_DB().collection('categories');
  const category = await db.findOne({ slug: slug });
  if (!category) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return category;
};

const createCategory = async (dataCategory) => {
  const validData = await validateBeforeCreate(dataCategory);
  const db = await GET_DB();
  const collection = db.collection('categories');
  const result = await collection.insertOne({
    ...validData,
    parentId: validData.parentId
      ? new ObjectId(validData.parentId)
      : validData.parentId,
  });
  if (!result) {
    throw new Error('Không thể thêm danh mục, xin thử lại sau');
  }
  return {
    _id: result.insertedId,
    ...validData,
  };
};

const update = async (id, data) => {
  const validData = await validateBeforeUpdate(data);
  const db = GET_DB().collection('categories');

  const result = await db.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...validData,
        parentId: validData.parentId
          ? new ObjectId(validData.parentId)
          : validData.parentId,
      },
    },
    { returnDocument: 'after' }
  );
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const deleteAllChildCategories = async (parentId) => {
  const db = GET_DB().collection('categories');
  const childCategories = await db
    .find({ parentId: new ObjectId(parentId) })
    .toArray();
  if (!childCategories) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  for (const child of childCategories) {
    await deleteAllChildCategories(child._id);
    if (child.imageURL) {
      await uploadModal.deleteImg(child.imageURL);
    }
    await db.deleteOne({ _id: child._id });
  }
};

const deleteCategory = async (id) => {
  const db = GET_DB().collection('categories');
  const category = await db.findOne({ _id: new ObjectId(id) });
  await db.deleteOne({ _id: new ObjectId(id) });
  if (!category) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return category;
};

const deleteManyCategories = async (ids) => {
  const db = GET_DB().collection('categories');
  const categories = await db
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
    .toArray();

  if (!categories || categories.length === 0) {
    throw new Error('Không tìm thấy thương hiệu nào');
  }

  const result = await db.deleteMany({
    _id: { $in: ids.map((id) => new ObjectId(id)) },
  });

  if (result.deletedCount === 0) {
    throw new Error('Xóa  không thành công');
  }

  const images = categories.map((cat) => cat.imageURL);

  return {
    images,
  };
};

export const categoryModel = {
  getCategoriesAll,
  countCategoryAll,
  createCategory,
  update,
  deleteCategory,
  getCategoryById,
  getCategoriesByParentId,
  deleteAllChildCategories,
  getCategoryBySlug,
  deleteManyCategories,
};
