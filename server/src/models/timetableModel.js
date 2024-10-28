import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { TIMETABLE_SCHEMA } from '~/utils/schema/timetableSchema';

const validateBeforeCreate = async (data) => {
  return await TIMETABLE_SCHEMA.validateAsync(data, { abortEarly: false });
};

const create = async (d) => {
  const validData = await validateBeforeCreate(d);
  validData.branchId = new ObjectId(validData.branchId);
  validData.staffId = new ObjectId(validData.staffId);
  validData.date = new Date(validData.date).setUTCHours(0, 0, 0, 0);
  validData.startTime = new Date(validData.startTime).getTime();
  validData.endTime = new Date(validData.endTime).getTime();
  const db = await GET_DB();
  const collection = db.collection('timetable');
  const result = await collection.insertOne(validData);
  return result;
};

const existingTimetable = async (value) => {
  const db = await GET_DB();
  const collection = db.collection('timetable');
  const result = await collection.findOne({
    staffId: value.staffId,
    branchId: value.branchId,
    date: value.date,
    $or: [
      { startTime: { $lt: value.endTime, $gte: value.startTime } },
      { endTime: { $gt: value.startTime, $lte: value.endTime } },
      { startTime: { $lte: value.startTime }, endTime: { $gte: value.endTime } }
    ]
  });
  return result;
}
const findOneBy = async (by = '_id', value) => {
  const db = await GET_DB();
  value = new ObjectId(value);
  const collection = db.collection('timetable');
  const result = await collection.findOne({ [by]: value });
  return result;
}
const findsBy = async ({
  by = 'staffId',
  value
}) => {
  const db = await GET_DB();
  const collection = db.collection('timetable');

  if (value === undefined) {
    const result = await collection.find().toArray();
    return result;
  }
  if (by === 'staffId' || by === 'branchId') {
    value = new ObjectId(value);
  } else if (by === 'date') {
    // Ensure value is a Number (Double) for date queries
    value = parseFloat(value); // Convert string to number
  }
  const result = await collection.find({ [by]: value }).toArray();
  return result;
}
const update = async (id, data) => {
  const validData = await validateBeforeCreate(data);
  validData.branchId = new ObjectId(validData.branchId);
  validData.staffId = new ObjectId(validData.staffId);
  validData.date = new Date(validData.date).setUTCHours(0, 0, 0, 0);
  validData.startTime = new Date(validData.startTime).getTime();
  validData.endTime = new Date(validData.endTime).getTime();
  const db = await GET_DB();
  const collection = db.collection('timetable');
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: validData },
    { returnDocument: 'after' } // Returns the updated document
  );
  return result;
}
const updateStatus = async (id, status) => {
  const db = await GET_DB();
  const collection = db.collection('timetable');
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status } },
    { returnDocument: 'after' } // Returns the updated document
  );
  return result;
}
const remove = async (id) => {
  const db = await GET_DB();
  const collection = db.collection('timetable');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result;
}
export const timetableModel = {
  create,
  existingTimetable,
  findOneBy,
  findsBy,
  update,
  updateStatus,
  remove
}