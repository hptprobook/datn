import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_SUPPLIER_SCHEMA, UPDATE_SUPPLIER } from '~/utils/schema';

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
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const db = await GET_DB().collection('suppliers');
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

const getSupplierById = async (supplier_id) => {
  const db = await GET_DB().collection('categories');
  const supplier = await db.findOne({ _id: new ObjectId(supplier_id) });
  return supplier;
};

const createSupplier = async (dataSupplier) => {
  try {
    const validData = await validateBeforeCreate(dataSupplier);
    const db = await GET_DB();
    const collection = db.collection('suppliers');

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
  return await UPDATE_SUPPLIER.validateAsync(data, { abortEarly: false });
};

const update = async (id, data) => {
  try {
    await validateBeforeUpdate(data);
    const result = await GET_DB()
      .collection('suppliers')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    return {
      error: true,
    };
  }
};

const deleteSupplier = async (id) => {
  try {
    const result = await GET_DB()
      .collection('suppliers')
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    return {
      error: true,
    };
  }
};

export const supplierModel = {
  countSupplierAll,
  getSuppliersAll,
  getSupplierById,
  createSupplier,
  deleteSupplier,
  update,
};
