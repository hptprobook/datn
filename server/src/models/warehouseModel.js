import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_WAREHOUSES,
  UPDATE_WAREHOUSES,
} from '~/utils/schema/warehouseSchema';
import { removeTones } from './removeTones';

const validateBeforeCreate = async (data) => {
  return await SAVE_WAREHOUSES.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_WAREHOUSES.validateAsync(data, { abortEarly: false });
};

const countInventoriesAll = async () => {
  const db = await GET_DB().collection('inventories');
  const total = await db.countDocuments();
  if (!total) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return total;
};

const getWarehousesAll = async () => {
  const db = await GET_DB().collection('warehouses');
  const result = await db
    .find()
    .toArray();
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const getWarehouseById = async (id) => {
  const db = await GET_DB().collection('warehouses');
  const warehouse = await db.findOne({ _id: new ObjectId(id) });
  if (!warehouse) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return warehouse;
};

const getWarehouseByName = async (name, page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const db = await GET_DB().collection('warehouses');

  const searchQuery = removeTones(name).toLowerCase();
  const searchTerms = searchQuery.split(' ');

  const warehouses = await db.find().toArray();

  const filteredProducts = warehouses.filter((warehouse) => {
    const nameNoTones = removeTones(warehouse.name).toLowerCase();

    const nameMatch = searchTerms.every((term) => nameNoTones.includes(term));

    return nameMatch;
  });

  const result = filteredProducts.slice((page - 1) * limit, page * limit);
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const createWarehouse = async (data) => {
  const validData = await validateBeforeCreate(data);
  const db = await GET_DB();
  const collection = db.collection('warehouses');
  const result = await collection.insertOne({
    ...validData,
  });
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const update = async (id, data) => {
  const db = GET_DB().collection('warehouses');

  const result = await db.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: data },
    { returnDocument: 'after' }
  );
  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return result;
};

const deleteWarehouse = async (id) => {
  const db = GET_DB().collection('warehouses');
  const warehouse = await db.findOne({ _id: new ObjectId(id) });
  await db.deleteOne({ _id: new ObjectId(id) });
  if (!warehouse) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }
  return warehouse;
};

export const warehouseModel = {
  getWarehousesAll,
  countInventoriesAll,
  createWarehouse,
  update,
  deleteWarehouse,
  getWarehouseById,
  getWarehouseByName,
};
