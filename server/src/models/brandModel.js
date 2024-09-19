import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_BRAND, UPDATE_BRAND } from '~/utils/schema/brandSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_BRAND.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_BRAND.validateAsync(data, { abortEarly: false });
};

const countBrandsAll = async () => {
  try {
    const db = await GET_DB().collection('brands');
    const total = await db.countDocuments();
    return total;
  } catch (error) {
    return {
      message: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getBrandsAll = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const db = await GET_DB().collection('brands');
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

const getBrandById = async (id) => {
  const db = await GET_DB().collection('brands');
  const brand = await db.findOne({ _id: new ObjectId(id) });
  return brand;
};

const getBrandBySlug = async (slug) => {
  const db = await GET_DB().collection('brands');
  const brand = await db.findOne({ slug: slug });
  return brand;
};

const createBrand = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const db = await GET_DB();
    const collection = db.collection('brands');
    const result = await collection.insertOne({
      ...validData,
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
    const db = GET_DB().collection('brands');

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: validData },
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

const deleteBrand = async (id) => {
  try {
    const db = GET_DB().collection('brands');
    const brand = await db.findOne({ _id: new ObjectId(id) });
    await db.deleteOne({ _id: new ObjectId(id) });
    return brand;
  } catch (error) {
    return { error };
  }
};

export const brandModel = {
  getBrandsAll,
  countBrandsAll,
  createBrand,
  update,
  deleteBrand,
  getBrandById,
  getBrandBySlug,
};
