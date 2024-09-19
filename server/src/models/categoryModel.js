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
  try {
    const db = await GET_DB().collection('categories');
    const total = await db.countDocuments();
    return total;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getCategoriesAll = async () => {
  try {
    const db = await GET_DB().collection('categories');
    const result = await db
      .find()
      // .project({ _id: 0, age:1 })
      .toArray();
    return result;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};
const getCategoriesByParentId = async (category_id) => {
  try {
    const db = await GET_DB().collection('categories');
    const result = await db.find({ parentId: category_id }).toArray();
    return result;
  } catch (error) {
    return {
      success: false,
      msg: 'Có lỗi xảy ra, xin thử lại sau',
    };
  }
};

const getCategoryById = async (category_id) => {
  const db = await GET_DB().collection('categories');
  const category = await db.findOne({ _id: new ObjectId(category_id) });
  return category;
};

const getCategoryBySlug = async (slug) => {
  const db = await GET_DB().collection('categories');
  const category = await db.findOne({ slug: slug });
  return category;
};

const createCategory = async (dataCategory) => {
  try {
    const validData = await validateBeforeCreate(dataCategory);
    const db = await GET_DB();
    const collection = db.collection('categories');
    const result = await collection.insertOne({
      ...validData,
      parentId: validData.parentId
        ? new ObjectId(validData.parentId)
        : validData.parentId,
    });
    return result;
  } catch (error) {
    if (error.details) {
      return { error: true, detail: error.details };
    }
    return { error: true, detail: error };
  }
};

const update = async (id, data) => {
  try {
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

    return { result: result };
  } catch (error) {
    if (error.details) {
      return { error: true, detail: error.details };
    }
    return { error: true, detail: error };
  }
};
const deleteAllChildCategories = async (parentId) => {
  const db = GET_DB().collection('categories');
  const childCategories = await db
    .find({ parentId: new ObjectId(parentId) })
    .toArray();

  for (const child of childCategories) {
    await deleteAllChildCategories(child._id);
    if (child.imageURL) {
      await uploadModal.deleteImg(child.imageURL);
    }
    await db.deleteOne({ _id: child._id });
  }
};

const deleteCategory = async (id) => {
  try {
    const db = GET_DB().collection('categories');
    const category = await db.findOne({ _id: new ObjectId(id) });
    await db.deleteOne({ _id: new ObjectId(id) });
    return category;
  } catch (error) {
    return {
      error: true,
    };
  }
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
};
