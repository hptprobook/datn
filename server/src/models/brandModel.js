import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';

const countBrandsAll = async () => {
  try {
    const db = await GET_DB().collection('brands');
    const total = await db.countDocuments();
    return total;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
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
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getBrandById = async (inventory_id) => {
  const db = await GET_DB().collection('brands');
  const inventory = await db.findOne({ _id: new ObjectId(inventory_id) });
  return inventory;
};

const createBrand = async (data) => {
  try {
    const db = await GET_DB();
    const collection = db.collection('brands');
    const result = await collection.insertOne({
      ...data,
    });
    return result;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const update = async (id, data) => {
  try {
    const db = GET_DB().collection('brands');

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

const deleteBrand = async (id) => {
  try {
    const db = GET_DB().collection('brands');
    const inventory = await db.findOne({ _id: new ObjectId(id) });
    await db.deleteOne({ _id: new ObjectId(id) });
    return inventory;
  } catch (error) {
    return {
      error: true,
    };
  }
};

export const brandModel = {
  getBrandsAll,
  countBrandsAll,
  createBrand,
  update,
  deleteBrand,
  getBrandById,
};
