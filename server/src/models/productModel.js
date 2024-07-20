import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_PRODUCT_SCHEMA, UPDATE_PRODUCT } from '~/utils/schema';

const validateBeforeCreate = async (data) => {
  return await SAVE_PRODUCT_SCHEMA.validateAsync(data, { abortEarly: false });
};

const countProductAll = async () => {
  try {
    const db = await GET_DB().collection('products');
    const total = await db.countDocuments();
    return total;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getProductsAll = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const db = await GET_DB().collection('products');
    const result = await db
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    return result;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const createProduct = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const db = await GET_DB();
    const collection = db.collection('products');

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
  return await UPDATE_PRODUCT.validateAsync(data, { abortEarly: false });
};

const update = async (id, data) => {
  try {
    await validateBeforeUpdate(data);
    const db = GET_DB().collection('products');
    const product = await db.findOne({ _id: new ObjectId(id) });

    if (!data.imgURLs || data.imgURLs.length === 0) {
      delete data.imgURLs;
    }

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );

    return { result: result, imageURL: product.imgURLs };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: error.message,
    };
  }
};

const deleteProduct = async (id) => {
  try {
    const db = GET_DB().collection('products');
    const product = await db.findOne({ _id: new ObjectId(id) });
    await db.deleteOne({ _id: new ObjectId(id) });
    return product.imgURLs;
  } catch (error) {
    return {
      error: true,
    };
  }
};

export const productModal = {
  countProductAll,
  getProductsAll,
  createProduct,
  deleteProduct,
  update,
};
