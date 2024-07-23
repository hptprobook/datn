import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_CATEGORY_SCHEMA, UPDATE_CATEGORY } from '~/utils/schema';

const validateBeforeCreate = async (data) => {
  return await SAVE_CATEGORY_SCHEMA.validateAsync(data, { abortEarly: false });
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
    const db = GET_DB().collection('categories');
    const category = await db.findOne({ _id: new ObjectId(id) });

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );

    return { result: result, imageURL: category.imageURL };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: error.message,
    };
  }
};

const deleteCategory = async (id) => {
  try {
    const db = GET_DB().collection('categories');
    const category = await db.findOne({ _id: new ObjectId(id) });
    await db.deleteOne({ _id: new ObjectId(id) });
    return category.imageURL;
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
