/* eslint-disable indent */
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  REVIEW_PRODUCT,
  SAVE_PRODUCT_SCHEMA,
  UPDATE_PRODUCT,
  UPDATE_REVIEW_PRODUCT,
} from '~/utils/schema/productSchema';

const validateRatingBeforeCreate = async (data) => {
  return await REVIEW_PRODUCT.validateAsync(data, { abortEarly: false });
};

const validateRatingBeforeUpdate = async (data) => {
  return await UPDATE_REVIEW_PRODUCT.validateAsync(data, { abortEarly: false });
};

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

const getProductBySlug = async (slug) => {
  const db = await GET_DB().collection('products');
  const product = await db.findOne({ slug: slug });
  return product;
};

const getProductsByCategory = async (slug) => {
  const db = await GET_DB();

  const category = await db.collection('categories').findOne({ slug: slug });

  if (!category) {
    throw new Error('Danh mục không tồn tại');
  }

  const cat_id = category._id;

  const products = await db
    .collection('products')
    .find({ cat_id: new ObjectId(cat_id) })
    .toArray();

  return products;
};

const createProduct = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const db = await GET_DB();
    const collection = db.collection('products');
    let validCat;

    if (Array.isArray(validData.cat_id)) {
      validCat = validData.cat_id.map((cat) => new ObjectId(cat));
    } else {
      validCat = new ObjectId(validData.cat_id);
    }

    const result = await collection.insertOne({
      ...validData,
      cat_id: validCat,
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

    if (Array.isArray(validData.cat_id)) {
      validCat = validData.cat_id.map((variant) => new ObjectId(variant));
    } else {
      validCat = new ObjectId(validData.cat_id);
    }

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...validData,
          cat_id: validCat,
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

const ratingProduct = async (data) => {
  try {
    const validData = await validateRatingBeforeCreate(data);
    const db = GET_DB().collection('products');

    const reviewId = new ObjectId();

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(validData.productId) },
      {
        $push: {
          reviews: {
            _id: reviewId,
            userId: new ObjectId(validData.userId),
            orderId: new ObjectId(validData.orderId),
            productId: new ObjectId(validData.productId),
            content: validData.content,
            rating: validData.rating,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
          },
        },
      },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    if (error.details) {
      return { error: true, detail: error.details };
    }
    return { error: true, detail: error };
  }
};

const updateRatingProduct = async (reviewId, data) => {
  try {
    const validData = await validateRatingBeforeUpdate(data);
    const db = GET_DB().collection('products');

    const result = await db.findOneAndUpdate(
      {
        'reviews._id': new ObjectId(reviewId),
      },
      {
        $set: {
          'reviews.$.userId': new ObjectId(validData.userId),
          'reviews.$.content': validData.content,
          'reviews.$.orderId': new ObjectId(validData.orderId),
          'reviews.$.productId': new ObjectId(validData.productId),
          'reviews.$.rating': validData.rating,
          'reviews.$.updatedAt': new Date().getTime(),
        },
      },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    if (error.details) {
      return { error: true, detail: error.details };
    }
    return { error: true, detail: error };
  }
};
const deleteRating = async (id) => {
  try {
    const result = await GET_DB()
      .collection('products')
      .updateOne(
        {
          'reviews._id': new ObjectId(id),
        },
        {
          $pull: {
            reviews: { _id: new ObjectId(id) },
          },
        }
      );
    return result;
  } catch (error) {
    return { error: true, detail: error.message };
  }
};

export const productModel = {
  countProductAll,
  getProductsAll,
  createProduct,
  deleteProduct,
  update,
  getProductById,
  ratingProduct,
  updateRatingProduct,
  deleteRating,
  getProductBySlug,
  getProductsByCategory,
};
