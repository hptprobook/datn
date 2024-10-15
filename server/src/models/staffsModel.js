import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { CREATE_STAFF_SCHEMA } from '~/utils/schema/staffSchema';

const validateBeforeCreate = async (data) => {
  return await CREATE_STAFF_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createStaff = async (dataStaff) => {
  const validData = await validateBeforeCreate(dataStaff);
  const db = await GET_DB();
  const collection = db.collection('staffs');
  const result = await collection.insertOne(validData);
  return result;
};
export const staffsModel = {
  createStaff,
}