import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { STATIC_PAGE_SCHEMA } from '~/utils/schema/staticPageSchema';

const validateBeforeCreate = async (data) => {
  return await STATIC_PAGE_SCHEMA.validateAsync(data, { abortEarly: false });
};
const validateBeforeUpdate = async (data) => {

  return await STATIC_PAGE_SCHEMA.validateAsync(data, { abortEarly: false });
};

const create = async (data) => {
  const validData = await validateBeforeCreate(data);
  const db = await GET_DB();
  const collection = db.collection('staticPages');
  const result = await collection.insertOne(validData);
  return result;
};
const getBy = async (by = '_id', value) => {
  const db = await GET_DB();
  if (by === '_id') {
    value = new ObjectId(value);
  }
  const collection = db.collection('staticPages');
  const staff = await collection.findOne({ [by]: value });
  return staff;
}
const update = async (id, data) => {
  const validData = await validateBeforeUpdate(data);
  const db = await GET_DB();
  const collection = db.collection('staticPages');
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: validData },
    { returnDocument: 'after' } // Returns the updated document
  );
  return result;
}
const remove = async (id) => {
  const db = await GET_DB();
  const collection = db.collection('staticPages');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result;
}

const gets = async () => {
  const db = await GET_DB();
  const collection = db.collection('staticPages');
  return await collection.find({}).toArray();
}
export const staticPagesModel = {
  create,
  getBy,
  gets,
  remove,
  update
}