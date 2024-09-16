import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { DASHBOARD_SCHEMA, DASHBOARD_SCHEMA_UPDATE } from '~/utils/schema/navSchema';

const validateBeforeCreate = async (data) => {
  return await DASHBOARD_SCHEMA.validateAsync(data, { abortEarly: false });
};
const validateBeforeUpdate = async (data) => {
  return await DASHBOARD_SCHEMA_UPDATE.validateAsync(data, { abortEarly: false });
};
const createdNavDashboard = async (data) => {
  const validData = await validateBeforeCreate(data);
  const db = await GET_DB().collection('navDashboard');
  const existedIndex = await db.findOne({ index: validData.index });
  if (existedIndex) {
    return { error: 'Index đã tồn tại' };
  }
  const result = await db.insertOne(validData);
  return db.findOne({ _id: result.insertedId });
};
const getNavDashboard = async () => {
  const db = await GET_DB().collection('navDashboard');
  return db.find({}).toArray();
}
const getNavDashboardById = async (id) => {
  const db = await GET_DB().collection('navDashboard');
  return db.findOne({ _id: new ObjectId(id) });
}
const removeNavDashboard = async (id) => {
  const db = await GET_DB().collection('navDashboard');
  const result = await db.findOne({ _id: new ObjectId(id) });
  if (!result) {
    return { error: 'Không tìm thấy dữ liệu' };
  }
  const remove = await db.deleteOne({ _id: new ObjectId(id) });
  if (remove.deletedCount === 0) {
    return { error: 'Xóa không thành công' };
  }
  return await db.find({}).toArray();
}
const updateNavDashboard = async (id, data) => {
  const validData = await validateBeforeUpdate(data);
  const db = await GET_DB().collection('navDashboard');
  const result = await db.findOne({ _id: new ObjectId(id) });

  if (!result) {
    return { error: 'Không tìm thấy dữ liệu' };
  }

  const updateObject = { $set: validData };
  if (!validData.child) {
    updateObject.$unset = { child: '' };
  }

  await db.updateOne({ _id: new ObjectId(id) }, updateObject);

  return db.find({}).toArray();
};
const updateMutipleNav = async (data) => {
  const db = await GET_DB().collection('navDashboard');
  const result = await db.find({}).toArray();
  if (!result) {
    return { error: 'Không tìm thấy dữ liệu' };
  }
  // console.log(data);
  const updateData = data.map((item) => {
    return {
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: {
          $set: {
            index: item.index,
          },
        },
      },
    };
  }
  );
  await db.bulkWrite(updateData);
  return db.find({}).toArray();
};

export const navDashboardModel = {
  createdNavDashboard,
  getNavDashboard,
  removeNavDashboard,
  updateNavDashboard,
  getNavDashboardById,
  updateMutipleNav,
};