import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_INVENTORIES_SCHEMA, UPDATE_CATEGORY } from '~/utils/schema';

const validateBeforeCreate = async (data) => {
  return await SAVE_INVENTORIES_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const countInventoriesAll = async () => {
  try {
    const db = await GET_DB().collection('inventories');
    const total = await db.countDocuments();
    return total;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getInventoriesAll = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const db = await GET_DB().collection('inventories');
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

const getInventoryById = async (inventory_id) => {
  const db = await GET_DB().collection('categories');
  const inventory = await db.findOne({ _id: new ObjectId(inventory_id) });
  return inventory;
};

const createInventory = async (dataInventory) => {
  try {
    // const validData = await validateBeforeCreate(dataInventory);
    const db = await GET_DB();
    const collection = db.collection('inventories');
    /*  const result = await collection.insertOne(validData);

    return result; */
    const result = await collection.insertOne({
      ...dataInventory,
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
  return await UPDATE_CATEGORY.validateAsync(data, { abortEarly: false });
};

const update = async (id, data) => {
  try {
    // await validateBeforeUpdate(data);
    const db = GET_DB().collection('inventories');

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
};

const deleteInventory = async (id) => {
  try {
    const db = GET_DB().collection('inventories');
    const inventory = await db.findOne({ _id: new ObjectId(id) });
    await db.deleteOne({ _id: new ObjectId(id) });
    return inventory;
  } catch (error) {
    return {
      error: true,
    };
  }
};

export const inventoryModel = {
  getInventoriesAll,
  countInventoriesAll,
  createInventory,
  update,
  deleteInventory,
  getInventoryById,
};
