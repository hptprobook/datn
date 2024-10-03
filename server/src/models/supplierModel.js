import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_SUPPLIER_SCHEMA,
  UPDATE_SUPPLIER,
} from '~/utils/schema/supplierSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_SUPPLIER_SCHEMA.validateAsync(data, { abortEarly: false });
};

const countSupplierAll = async () => {
  try {
    const db = await GET_DB().collection('suppliers');
    const total = await db.countDocuments();
    return total;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getSuppliersAll = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const db = await GET_DB().collection('suppliers');
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

const getSupplierById = async (supplier_id) => {
  const db = await GET_DB().collection('suppliers');
  const supplier = await db.findOne({ _id: new ObjectId(supplier_id) });
  return supplier;
};

const createSupplier = async (dataSupplier) => {
  const validData = await validateBeforeCreate(dataSupplier);
  const db = await GET_DB();
  const collection = db.collection('suppliers');

  const result = await collection.insertOne(validData);
  if (result.insertedCount === 0) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_SUPPLIER.validateAsync(data, { abortEarly: false });
};

const update = async (id, data) => {
  const dataUpdate = await validateBeforeUpdate(data);
  const result = await GET_DB()
    .collection('suppliers')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dataUpdate },
      { returnDocument: 'after' }
    );
  return result;
};

const deleteSupplier = async (id) => {
  const result = await GET_DB()
    .collection('suppliers')
    .deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const deleteAllSuppliers = async () => {
  const result = await GET_DB().collection('suppliers').deleteMany({});
  if (!result || result.deletedCount === 0) {
    throw new Error('Không có nhà cung cấp nào để xóa.');
  }
  return result;
};

const deleteManySuppliers = async (ids) => {
  const db = GET_DB().collection('suppliers');

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

export const supplierModel = {
  countSupplierAll,
  getSuppliersAll,
  getSupplierById,
  createSupplier,
  deleteSupplier,
  update,
  deleteAllSuppliers,
  deleteManySuppliers,
};
