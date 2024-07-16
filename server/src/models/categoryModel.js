import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_CATEGORY_SCHEMA, UPDATE_CATEGORY } from '~/utils/schema';

const validateBeforeCreate = async (data) => {
  return await SAVE_CATEGORY_SCHEMA.validateAsync(data, { abortEarly: false });
};

const countCategoryAll = async () => {
  try {
    const db = await GET_DB().collection('categories');
    const totail = await db.countDocuments();
    return totail;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getCategoriesAll = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const db = await GET_DB().collection('categories');
    const result = await db
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
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

const createCategory = async (dataCategory) => {
  try {
    const validData = await validateBeforeCreate(dataCategory);
    const db = await GET_DB();
    const collection = db.collection('categories');
    /*  const result = await collection.insertOne(validData);

    return result; */
    const result = await collection.insertOne({
      ...validData,
    });
    return result;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_CATEGORY.validateAsync(data, { abortEarly: false });
};

const update = async (id, data) => {
  try {
    await validateBeforeUpdate(data);
    const result = await GET_DB()
      .collection('categories')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' }
      );
    delete result.password;
    return result;
  } catch (error) {
    return {
      error: true,
    };
  }
};

const deleteCategory = async (id) => {
  try {
    const result = await GET_DB()
      .collection('categories')
      .deleteOne({ _id: new ObjectId(id) });
    return result;
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
};
