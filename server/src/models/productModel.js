/* eslint-disable indent */
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_PRODUCT_SCHEMA,
  UPDATE_PRODUCT,
} from '~/utils/schema/productSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_PRODUCT_SCHEMA.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_PRODUCT.validateAsync(data, { abortEarly: false });
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

const getProductById = async (product_id) => {
  const db = await GET_DB().collection('products');
  const product = await db.findOne({ _id: new ObjectId(product_id) });
  return product;
};

const createProduct = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const db = await GET_DB();
    const collection = db.collection('products');
    let validCat;

    if (validData.catId.length > 0) {
      validCat = validData.catId.map((cat) => new ObjectId(cat));
    } else {
      validCat = new ObjectId(validData.catId);
    }

    const result = await collection.insertOne({
      ...validData,
      catId: validCat,
      productType: new ObjectId(validData.productType),
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
    const db = GET_DB().collection('products');
    let validCat;

    if (validData.catId.length > 0) {
      validCat = validData.catId.map((cat) => new ObjectId(cat));
    } else {
      validCat = new ObjectId(validData.catId);
    }

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...validData,
          catId: validCat,
          productType: new ObjectId(validData.productType),
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

const deleteProduct = async (id) => {
  try {
    const db = GET_DB().collection('products');
    const product = await db.findOne({ _id: new ObjectId(id) });
    await db.deleteOne({ _id: new ObjectId(id) });
    return { thumbnail: product.thumbnail, images: product.images };
  } catch (error) {
    return {
      error: true,
    };
  }
};

export const productModel = {
  countProductAll,
  getProductsAll,
  createProduct,
  deleteProduct,
  update,
  getProductById,
};
