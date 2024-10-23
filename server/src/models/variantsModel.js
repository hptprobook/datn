import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_VARIANT, UPDATE_VARIANT } from '~/utils/schema/variantsSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_VARIANT.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_VARIANT.validateAsync(data, { abortEarly: false });
};

const getVariantAll = async () => {
  const db = await GET_DB().collection('variants');
  const result = await db.find().sort({ createdAt: 1 }).toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const create = async (data) => {
  const validData = await validateBeforeCreate(data);
  const db = await GET_DB();
  const collection = db.collection('variants');
  const result = await collection.insertOne({
    ...validData,
  });
  if (!result) {
    throw new Error('Không thể thêm biến thể, xin thử lại sau');
  }
  return {
    _id: result.insertedId,
    ...validData,
  };
};

const update = async (id, data) => {
  const validData = await validateBeforeUpdate(data);
  const db = GET_DB().collection('variants');
  const variant = await db.findOne({ _id: new ObjectId(id) });
  if (!variant) {
    throw new Error('Không tìm thấy biến thể');
  }
  const result = await db.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: validData },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return {
    data: result,
  };
};

const getVariantByName = async (name) => {
  const db = await GET_DB().collection('variants');
  const variant = await db.findOne({ name: name });
  return variant;
};

const getVariantById = async (id) => {
  const db = await GET_DB().collection('variants');
  const variant = await db.findOne({ _id: new ObjectId(id) });
  return variant;
};

const deleteVariant = async (id) => {
  const db = GET_DB().collection('variants');
  const variant = await db.findOne({ _id: new ObjectId(id) });

  if (!variant) {
    throw new Error('Không tìm thấy biến thể');
  }

  const result = await db.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    throw new Error('Xóa biến thể không thành công');
  }
  return {
    result,
  };
};

const deleteAllVariant = async () => {
  const variants = await GET_DB().collection('variants').find().toArray();
  const result = await GET_DB().collection('variants').deleteMany({});

  if (!result || result.deletedCount === 0) {
    throw new Error('Không có biến thể nào để xóa.');
  }
  return variants;
};

const deleteManyVariants = async (ids) => {
  const db = GET_DB().collection('variants');
  const variants = await db
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
    .toArray();

  if (!variants || variants.length === 0) {
    throw new Error('Không tìm thấy biến thể nào');
  }

  const result = await db.deleteMany({
    _id: { $in: ids.map((id) => new ObjectId(id)) },
  });

  if (result.deletedCount === 0) {
    throw new Error('Xóa không thành công');
  }

  return {
    result,
  };
};

export const variantsModel = {
  getVariantAll,
  create,
  update,
  getVariantByName,
  deleteVariant,
  getVariantById,
  deleteAllVariant,
  deleteManyVariants,
};
