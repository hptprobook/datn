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

const getCategoryByViews = async () => {
  try {
    const db = await GET_DB().collection('categories');
    const categories = await db
      .find({ parentId: { $ne: 'ROOT' } })
      .sort({ views: -1 })
      .limit(parseInt(12))
      .toArray();

    return categories;
  } catch (error) {
    throw new Error(
      'Không tìm thấy danh mục hoặc có lỗi xảy ra, xin thử lại sau',
      error
    );
  }
};

const increaseViewBySlug = async (slug) => {
  const db = await GET_DB().collection('categories');

  const result = await db.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new Error(
      'Không tìm thấy danh mục hoặc có lỗi xảy ra, xin thử lại sau'
    );
  }

  return result;
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
  const result = await db.find().sort({ createdAt: -1 }).toArray();
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
  return category;
};

const getCategoryByIds = async (ids) => {
  const db = await GET_DB().collection('categories');

  const categories = await db.find({
    _id: { $in: ids.map((id) => new ObjectId(id)) },
  });

  return categories;
};

const getCategoryBySlug = async (slug) => {
  const db = await GET_DB().collection('categories');
  const category = await db.findOne({ slug: slug });
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
  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }
  await db.deleteOne({ _id: new ObjectId(id) });
  return category;
};

const deleteManyCategories = async (ids) => {
  if (!Array.isArray(ids)) {
    throw new Error('Ids phải là một mảng');
  }

  const db = GET_DB().collection('categories');

  const categories = await db
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
    .toArray();

  if (!categories || categories.length === 0) {
    throw new Error('Không tìm thấy danh mục nào');
  }

  const result = await db.deleteMany({
    _id: { $in: ids.map((id) => new ObjectId(id)) },
  });

  if (result.deletedCount === 0) {
    throw new Error('Xóa không thành công');
  }

  const remainingCategories = await db
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
    .toArray();

  const remainingIds = remainingCategories.map((cat) => cat._id.toString());

  const deletedIds = ids.filter((id) => !remainingIds.includes(id));

  const images = categories
    .filter((cat) => deletedIds.includes(cat._id.toString()))
    .map((cat) => cat.imageURL);

  return {
    images,
    deletedIds,
    failedIds: remainingIds,
  };
};

export const categoryModel = {
  getCategoriesAll,
  countCategoryAll,
  createCategory,
  increaseViewBySlug,
  getCategoryByViews,
  update,
  deleteCategory,
  getCategoryById,
  getCategoryByIds,
  getCategoriesByParentId,
  deleteAllChildCategories,
  getCategoryBySlug,
  deleteManyCategories,
};
