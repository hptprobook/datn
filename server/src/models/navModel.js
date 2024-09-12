import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { DASHBOARD_SCHEMA } from '~/utils/schema/navSchema';

const validateBeforeCreate = async(data) => {
    return await DASHBOARD_SCHEMA.validateAsync(data, { abortEarly: false });
};
const createdNavDashboard = async (data) => {
  const validData = await validateBeforeCreate(data);
  const db = await GET_DB().collection('navDashboard');
  const result = await db.insertOne(validData);
  return db.findOne({ _id: result.insertedId });
};
const getNavDashboard = async () => {
  const db = await GET_DB().collection('navDashboard');
  return db.find({}).toArray();
}

export const navDashboardModel = {
    createdNavDashboard,
    getNavDashboard
};