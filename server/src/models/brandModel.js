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
  const db = await GET_DB().collection('brands');
  const total = await db.countDocuments();
  if (!total) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return total;
};

const getBrandsAll = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const db = await GET_DB().collection('brands');
  const result = await db
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const getBrandById = async (id) => {
  const db = await GET_DB().collection('brands');
  const brand = await db.findOne({ _id: new ObjectId(id) });
  if (!brand) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return brand;
};

const getBrandBySlug = async (slug) => {
  const db = await GET_DB().collection('brands');
  const brand = await db.findOne({ slug: slug });
  if (!brand) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return brand;
};

const create = async (data) => {
  const validData = await validateBeforeCreate(data);
  const db = await GET_DB();
  const collection = db.collection('brands');
  const result = await collection.insertOne({
    ...validData,
  });
  if (!result || !result.insertedId) {
    throw new Error('Không thể thêm thương hiệu, xin thử lại sau');
  }
  return {
    _id: result.insertedId,
    ...validData,
  };
};

const update = async (id, data) => {
  const validData = await validateBeforeUpdate(data);
  const db = GET_DB().collection('brands');

  const result = await db.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: validData },
    { returnDocument: 'after' }
  );
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return { result: result };
};

const deleteBrand = async (id) => {
  const db = GET_DB().collection('brands');
  const brand = await db.findOne({ _id: new ObjectId(id) });
  await db.deleteOne({ _id: new ObjectId(id) });
  if (!brand) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return brand;
};

export const brandModel = {
  getBrandsAll,
  countBrandsAll,
  create,
  update,
  deleteBrand,
  getBrandById,
  getBrandBySlug,
};
