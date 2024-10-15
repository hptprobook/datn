import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';

const getHotSearch = async () => {
  const db = await GET_DB().collection('hotSearch');
  const result = await db.find().toArray();
  return result;
};

const createHotSearch = async (data) => {
  data = {
    ...data,
    keyword: data.keyword.trim().toLowerCase(),
    count: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const db = await GET_DB().collection('hotSearch');
  const result = await db.insertOne(data);
  return result;
};
const deleteHotSearch = async (id) => {
  const db = await GET_DB().collection('hotSearch');
  const result = await db.deleteOne({ _id: ObjectId(id) });
  return result;
};

const updateHotSearch = async (id, data) => {
  const db = await GET_DB().collection('hotSearch');
  const result = await db.updateOne({ _id: ObjectId(id) }, { $set: data });
  return result;
};

const plusCountHotSearch = async (id) => {
  const db = await GET_DB().collection('hotSearch');
  const result = await db.updateOne(
    { _id: id },
    { $inc: { count: 1 }, $set: { updatedAt: new Date() } }
  );

  return result;
};

const findHotSearchByKeyword = async (keyword) => {
  const db = await GET_DB().collection('hotSearch');
  const result = await db.findOne({ keyword: keyword.trim().toLowerCase() });
  return result;
};

export const hotSearchModel = {
  getHotSearch,
  createHotSearch,
  deleteHotSearch,
  updateHotSearch,
  plusCountHotSearch,
  findHotSearchByKeyword,
};
