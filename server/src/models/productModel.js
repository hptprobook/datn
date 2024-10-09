/* eslint-disable indent */
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  REVIEW_PRODUCT,
  SAVE_PRODUCT_SCHEMA,
  UPDATE_PRODUCT,
  UPDATE_REVIEW_PRODUCT,
} from '~/utils/schema/productSchema';
import { removeTones } from './removeTones';

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
  const db = await GET_DB().collection('products');
  const total = await db.countDocuments();
  if (!total) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return total;
};

const getProductsAll = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const db = await GET_DB().collection('products');
  const result = await db
    .find()
    .sort({ createdAt: 1 })
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  result.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });
  return result;
};

const getProductsAllSpecial = async () => {
  const db = await GET_DB().collection('products');
  const result = await db
    .find()
    .project({
      _id: 1,
      name: 1,
      thumbnail: 1,
    })
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }

  return result;
};

const getProductById = async (product_id) => {
  const db = await GET_DB().collection('products');
  const product = await db.findOne({ _id: new ObjectId(product_id) });
  if (!product) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return product;
};

const getProductBySlug = async (slug) => {
  const db = await GET_DB().collection('products');
  const product = await db.findOne({ slug: slug });
  if (!product) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return product;
};

const getAllSubCategories = async (parentId) => {
  const db = await GET_DB();
  const subCategories = await db
    .collection('categories')
    .find({ parentId: parentId.toString() })
    .toArray();
  const allSubCategories = [];

  for (const subCategory of subCategories) {
    allSubCategories.push(subCategory._id);
    const nestedSubCategories = await getAllSubCategories(subCategory._id);
    allSubCategories.push(...nestedSubCategories);
  }

  return allSubCategories;
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

  const subCategoryIds = await getAllSubCategories(cat_id);

  const categoryIds = [cat_id, ...subCategoryIds];

  const products = await db
    .collection('products')
    .find({ cat_id: { $in: categoryIds } })
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  if (!products) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }

  products.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });
  return products;
};

const getProductsByCategoryId = async (id, page, limit) => {
  const db = await GET_DB();
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  const subCategoryIds = await getAllSubCategories(id);

  const categoryIds = [id, ...subCategoryIds];

  const products = await db
    .collection('products')
    .find({ cat_id: { $in: categoryIds } })
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  if (!products) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  products.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });
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
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!products) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  products.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });
  return products;
};

const getProductsByBrandId = async (id, page, limit) => {
  const db = await GET_DB();
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const products = await db
    .collection('products')
    .find({ brand: new ObjectId(id) })
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!products) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  products.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });
  return products;
};

const createProduct = async (data) => {
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
    productType: validData.productType,
  });
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const update = async (id, data) => {
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
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return { result: result };
};

const deleteProduct = async (id) => {
  const db = GET_DB().collection('products');
  const product = await db.findOne({ _id: new ObjectId(id) });
  await db.deleteOne({ _id: new ObjectId(id) });
  if (!product) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return {
    thumbnail: product.thumbnail,
    images: product.images,
    variants: product.variants,
  };
};

const ratingProduct = async (data) => {
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
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const updateRatingProduct = async (reviewId, data) => {
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
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};
const deleteRating = async (id) => {
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
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const getProductByAlphabetAZ = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  const db = await GET_DB().collection('products');
  const result = await db
    .find()
    .collation({ locale: 'en', strength: 1 })
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .sort({ name: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  result.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });
  return result;
};

const getProductByAlphabetZA = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  const db = await GET_DB().collection('products');
  const result = await db
    .find()
    .collation({ locale: 'en', strength: 1 })
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .sort({ name: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  result.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });
  return result;
};

const getProductByPriceAsc = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  const db = await GET_DB().collection('products');
  const result = await db
    .find()
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .sort({ price: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  result.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });

  return result;
};

const getProductByPriceDesc = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  const db = await GET_DB().collection('products');
  const result = await db
    .find()
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .sort({ price: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  result.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });
  return result;
};

const getProductByNewest = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  const db = await GET_DB().collection('products');
  const result = await db
    .find()
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  result.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });

  return result;
};

const getProductByOldest = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  const db = await GET_DB().collection('products');
  const result = await db
    .find()
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      variants: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  result.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });

  return result;
};

const getProductBySearch = async (search, page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  const searchQuery = removeTones(search).toLowerCase().replace(/\s+/g, '-');

  const db = await GET_DB();

  const results = await db
    .collection('products')
    .find({ slug: { $regex: searchQuery, $options: 'i' } })
    .collation({ locale: 'en', strength: 2 })
    .limit(limit)
    .skip((page - 1) * limit)
    .toArray();

  return results;
};

const getProductByCategoryFilter = async (slug, pages, limit, filter) => {
  pages = parseInt(pages) || 1;
  limit = parseInt(limit) || 20;

  const db = await GET_DB();

  let sortCriteria = {};
  const [field, order] = Object.entries(filter)[0];

  switch (field) {
    case 'alphabet':
      if (order.toLowerCase() === 'az') {
        sortCriteria = { name: 1 };
      } else if (order.toLowerCase() === 'za') {
        sortCriteria = { name: -1 };
      }
      break;

    case 'price':
      if (order.toLowerCase() === 'asc') {
        sortCriteria = { price: 1 };
      } else if (order.toLowerCase() === 'desc') {
        sortCriteria = { price: -1 };
      }
      break;

    case 'createdAt':
      if (order.toLowerCase() === 'newest') {
        sortCriteria = { createdAt: -1 };
      } else if (order.toLowerCase() === 'oldest') {
        sortCriteria = { createdAt: 1 };
      }
      break;

    default:
      sortCriteria = {};
      break;
  }

  const category = await db.collection('categories').findOne({ slug: slug });
  if (!category) {
    throw new Error('Danh mục không tồn tại');
  }

  const cat_id = category._id;

  const subCategoryIds = await getAllSubCategories(cat_id);

  const categoryIds = [cat_id, ...subCategoryIds];

  const result = await db
    .collection('products')
    .find({ cat_id: { $in: categoryIds } })
    .collation({ locale: 'en', strength: 1 })
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .sort(sortCriteria)
    .skip((pages - 1) * limit)
    .limit(limit)
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  result.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });

  return result;
};

const getProductsByEvent = async (slug, pages, limit) => {
  pages = parseInt(pages) || 1;
  limit = parseInt(limit) || 20;
  const db = await GET_DB();

  const category = await db.collection('categories').findOne({ slug: slug });
  if (!category) {
    throw new Error('Danh mục không tồn tại');
  }

  const cat_id = category._id;
  const subCategoryIds = await getAllSubCategories(cat_id);
  const categoryIds = [cat_id, ...subCategoryIds];

  const products = await db
    .collection('products')
    .find({ cat_id: { $in: categoryIds } })
    .project({
      _id: 1,
      name: 1,
      productType: 1,
      tags: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .skip((pages - 1) * limit)
    .limit(5)
    .toArray();

  if (!products) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }

  const categorizedProducts = {
    nam: [],
    nu: [],
    treEm: [],
  };

  products.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }

    if (product.productType.includes('Nam')) {
      categorizedProducts.nam.push(product);
    }
    if (product.productType.includes('Nữ')) {
      categorizedProducts.nu.push(product);
    }
    if (product.productType.includes('Trẻ em')) {
      categorizedProducts.treEm.push(product);
    }

    delete product.reviews;
    delete product.productType;
  });

  return categorizedProducts;
};

const getProductsBySlugAndPriceRange = async (
  slug,
  minPrice,
  maxPrice,
  page,
  limit,
  sortCriteria,
  colors,
  sizes
) => {
  const db = await GET_DB();

  const category = await db.collection('categories').findOne({ slug: slug });
  if (!category) {
    throw new Error('Danh mục không tồn tại');
  }

  const cat_id = category._id;
  const subCategoryIds = await getAllSubCategories(cat_id);
  const categoryIds = [cat_id, ...subCategoryIds];

  let sortOption = {};

  if (sortCriteria && Object.keys(sortCriteria).length > 0) {
    const [field, order] = Object.entries(sortCriteria)[0];

    switch (field) {
      case 'alphabet':
        sortOption = { name: order.toLowerCase() === 'az' ? 1 : -1 };
        break;
      case 'price':
        sortOption = { price: order.toLowerCase() === 'asc' ? 1 : -1 };
        break;
      case 'createdAt':
        sortOption = { createdAt: order.toLowerCase() === 'newest' ? -1 : 1 };
        break;
      default:
        sortOption = {};
    }
  }

  let query = {
    cat_id: { $in: categoryIds },
    price: { $gte: minPrice, $lte: maxPrice },
  };

  if (colors && colors.length > 0) {
    query['variants.color'] = { $in: colors };
  }

  if (sizes && sizes.length > 0) {
    query['variants.sizes.size'] = { $in: sizes };
  }

  const products = await db
    .collection('products')
    .find(query)
    .project({
      _id: 1,
      name: 1,
      tags: 1,
      reviews: 1,
      price: 1,
      thumbnail: 1,
      status: 1,
      statusStock: 1,
      slug: 1,
    })
    .collation({ locale: 'en', strength: 2 })
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  if (!products) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }

  products.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.averageRating = parseFloat(
        (total / product.reviews.length).toFixed(1)
      );
      product.totalComment = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.totalComment = 0;
    }
    delete product.reviews;
  });

  return products;
};

const getMinMaxProductPrices = async () => {
  const db = await GET_DB();
  const result = await db
    .collection('products')
    .aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ])
    .toArray();

  if (!result || result.length === 0) {
    throw new Error('Không thể lấy giá sản phẩm');
  }

  return {
    minPrice: result[0].minPrice,
    maxPrice: result[0].maxPrice,
  };
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
  getProductByCategoryFilter,
  getProductsByEvent,
  getProductsBySlugAndPriceRange,
  getMinMaxProductPrices,
};
