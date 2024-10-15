import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { CREATE_STAFF_SCHEMA, UPDATE_ME_SCHEMA, UPDATE_STAFF_SCHEMA } from '~/utils/schema/staffSchema';

const validateBeforeCreate = async (data) => {
  return await CREATE_STAFF_SCHEMA.validateAsync(data, { abortEarly: false });
};
const validateBeforeUpdate = async (data, type) => {
  if (type === 'me') {
    return await UPDATE_ME_SCHEMA.validateAsync(data, { abortEarly: false });
  }
  return await UPDATE_STAFF_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createStaff = async (dataStaff) => {
  const validData = await validateBeforeCreate(dataStaff);
  validData.branchId = new ObjectId(validData.branchId);
  const db = await GET_DB();
  const collection = db.collection('staffs');
  const result = await collection.insertOne(validData);
  return result;
};
const getStaffBy = async (by = 'email', value) => {
  const db = await GET_DB();
  if (by === '_id') {
    value = new ObjectId(value);
  }
  const collection = db.collection('staffs');
  const staff = await collection.findOne({ [by]: value });
  return staff;
}
const updateStaff = async (dataStaff) => {
  const validData = await validateBeforeUpdate(dataStaff, 'all');
  const db = await GET_DB();
  const collection = db.collection('staffs');
  const result = await collection.updateOne({ _id: new ObjectId(validData._id) }, { $set: validData });
  return result;
}
const updateMe = async (id, dataStaff) => {
  const validData = await validateBeforeUpdate(dataStaff, 'me');
  const db = await GET_DB();
  const collection = db.collection('staffs');
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: validData });
  return result;
}
const getStaffs = async () => {
  const db = await GET_DB();
  const collection = db.collection('staffs');
  const staffs = await collection.find({}).toArray();
  return staffs;
}
export const staffsModel = {
  createStaff,
  getStaffBy,
  getStaffs,
  updateMe,
  updateStaff
}