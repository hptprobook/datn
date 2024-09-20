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
      message: 'Có lỗi xảy ra xin thử lại sau',
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
      message: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getProductsAllSpecial = async () => {
  try {
    const db = await GET_DB().collection('products');
    const result = await db
      .find()
      .project({
        _id: 1,
        name: 1,
        thumbnail: 1,
      })
      .toArray();

    return result;
  } catch (error) {
    return {
      message: 'Có lỗi xảy ra xin thử lại sau',
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

const getProductsByCategory = async (slug, page, limit) => {
  const db = await GET_DB();
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const category = await db.collection('categories').findOne({ slug: slug });

  if (!category) {
    throw new Error('Danh mục không tồn tại');
  }

  const cat_id = category._id;

  const products = await db
    .collection('products')
    .find({ cat_id: new ObjectId(cat_id) })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return products;
};

const getProductsByBrand = async (slug, page, limit) => {
  const db = await GET_DB();
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const brand = await db.collection('brands').findOne({ slug: slug });

  if (!brand) {
    throw new Error('Thương hiệu không tồn tại');
  }

  const brandId = brand._id;

  const products = await db
    .collection('products')
    .find({ brand: new ObjectId(brandId) })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return products;
};

const getProductsByCategoryId = async (id, page, limit) => {
  const db = await GET_DB();
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const products = await db
    .collection('products')
    .find({ cat_id: new ObjectId(id) })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return products;
};

const getProductsByBrandId = async (id, page, limit) => {
  const db = await GET_DB();
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const products = await db
    .collection('products')
    .find({ brand: new ObjectId(id) })
    .skip((page - 1) * limit)
    .limit(limit)
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
      brand: new ObjectId(validData.brand),
      productType: new ObjectId(validData.productType),
    });

    return result;
  } catch (error) {
    if (error.details) {
      return { detail: error.details };
    }
    return { detail: error };
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
      return { detail: error.details };
    }
    return { detail: error };
  }
};

const deleteProduct = async (id) => {
  try {
    const db = GET_DB().collection('products');
    const product = await db.findOne({ _id: new ObjectId(id) });
    await db.deleteOne({ _id: new ObjectId(id) });
    return {
      thumbnail: product.thumbnail,
      images: product.images,
      variants: product.variants,
    };
  } catch (error) {
    return {
      error,
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
      return { detail: error.details };
    }
    return { detail: error };
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
      return { detail: error.details };
    }
    return { detail: error };
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
    return { detail: error.message };
  }
};

const getProductByAlphabetAZ = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    const db = await GET_DB().collection('products');
    const result = await db
      .find()
      .collation({ locale: 'en', strength: 1 })
      .project({
        content: 0,
        description: 0,
        images: 0,
        variants: 0,
        inventory: 0,
        minInventory: 0,
        maxInventory: 0,
        weight: 0,
        height: 0,
      })
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return result;
  } catch (error) {
    return {
      message: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getProductByAlphabetZA = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    const db = await GET_DB().collection('products');
    const result = await db
      .find()
      .collation({ locale: 'en', strength: 1 })
      .project({
        content: 0,
        description: 0,
        images: 0,
        variants: 0,
        inventory: 0,
        minInventory: 0,
        maxInventory: 0,
        weight: 0,
        height: 0,
      })
      .sort({ name: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return result;
  } catch (error) {
    return {
      message: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getProductByPriceAsc = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    const db = await GET_DB().collection('products');
    const result = await db
      .find()
      .project({
        content: 0,
        description: 0,
        images: 0,
        variants: 0,
        inventory: 0,
        minInventory: 0,
        maxInventory: 0,
        weight: 0,
        height: 0,
      })
      .sort({ price: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return result;
  } catch (error) {
    return {
      message: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getProductByPriceDesc = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    const db = await GET_DB().collection('products');
    const result = await db
      .find()
      .project({
        content: 0,
        description: 0,
        images: 0,
        variants: 0,
        inventory: 0,
        minInventory: 0,
        maxInventory: 0,
        weight: 0,
        height: 0,
      })
      .sort({ price: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return result;
  } catch (error) {
    return {
      message: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getProductByNewest = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    const db = await GET_DB().collection('products');
    const result = await db
      .find()
      .project({
        content: 0,
        description: 0,
        images: 0,
        variants: 0,
        inventory: 0,
        minInventory: 0,
        maxInventory: 0,
        weight: 0,
        height: 0,
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return result;
  } catch (error) {
    return {
      message: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getProductByOldest = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    const db = await GET_DB().collection('products');
    const result = await db
      .find()
      .project({
        content: 0,
        description: 0,
        images: 0,
        variants: 0,
        inventory: 0,
        minInventory: 0,
        maxInventory: 0,
        weight: 0,
        height: 0,
      })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return result;
  } catch (error) {
    return {
      message: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const removeTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const getProductBySearch = async (search, page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    const searchQuery = removeTones(search).toLowerCase();
    const searchTerms = searchQuery.split(' ');

    const db = await GET_DB();

    const categories = await db.collection('categories').find().toArray();
    const brands = await db.collection('brands').find().toArray();

    const categoryIds = categories
      .filter((category) =>
        searchTerms.every((term) =>
          removeTones(category.name).toLowerCase().includes(term)
        )
      )
      .map((category) => category._id);

    const brandIds = brands
      .filter((brand) =>
        searchTerms.every((term) =>
          removeTones(brand.name).toLowerCase().includes(term)
        )
      )
      .map((brand) => brand._id);

    const allProducts = await db.collection('products').find().toArray();

    const filteredProducts = allProducts.filter((product) => {
      /*   const nameNoTones = removeTones(product.name).toLowerCase();
      const descriptionNoTones = removeTones(product.description).toLowerCase();
      const contentNoTones = removeTones(product.content).toLowerCase();
      const tagsNoTones = product.tags.map((tag) =>
        removeTones(tag).toLowerCase()
      );

      const nameMatch = searchTerms.every((term) => nameNoTones.includes(term));
      const descriptionMatch = searchTerms.every((term) =>
        descriptionNoTones.includes(term)
      );
      const contentMatch = searchTerms.every((term) =>
        contentNoTones.includes(term)
      );
      const tagsMatch = tagsNoTones.some((tag) =>
        searchTerms.every((term) => tag.includes(term))
      ); */

      const categoryMatch =
        categoryIds.length > 0 ? categoryIds.includes(product.cat_id) : true;
      const brandMatch =
        brandIds.length > 0
          ? brandIds.some((id) => id.equals(product.brand))
          : true;

      return (
        /*         nameMatch ||
        descriptionMatch ||
        contentMatch ||
        tagsMatch || */
        categoryMatch || brandMatch
      );
    });

    const result = filteredProducts
      .slice((page - 1) * limit, page * limit)
      .map(
        ({
          content,
          description,
          images,
          variants,
          inventory,
          minInventory,
          maxInventory,
          weight,
          height,
          reviews,
          ...rest
        }) => rest
      );

    return result;
  } catch (error) {
    return { message: 'Có lỗi xảy ra xin thử lại sau' };
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
  getProductsByCategoryId,
  getProductsByBrand,
  getProductsByBrandId,
  getProductByAlphabetAZ,
  getProductByAlphabetZA,
  getProductByPriceAsc,
  getProductByPriceDesc,
  getProductByNewest,
  getProductByOldest,
  getProductBySearch,
  getProductsAllSpecial,
};
