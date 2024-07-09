import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_USER_SCHEMA, UPDATE_USER } from '~/utils/schema';

const validateBeforeCreate = async (data) => {
  return await SAVE_USER_SCHEMA.validateAsync(data, { abortEarly: false });
};

const countUserAll = async () => {
  try {
    const db = await GET_DB().collection('users');
    const totail = await db.countDocuments();
    return totail;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const getUserAll = async (page, limit) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 2;
    const db = await GET_DB().collection('users');
    const totail = await db.countDocuments();
    const result = await db
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      // .project({ _id: 0, age:1 })
      .toArray();
    return result;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};

const register = async (dataUser) => {
  try {
    const validData = await validateBeforeCreate(dataUser);
    const db = await GET_DB();
    const collection = db.collection('users');
    const result = await collection.insertOne(validData);
    return result;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử lại sau',
    };
  }
};
const getUserEmail = async (email) => {
  const db = await GET_DB();
  const collection = db.collection('users');
  const user = await collection.findOne({ email: email });
  return user;
};

const getUserID = async (user_id) => {
  try {
    const db = await GET_DB().collection('users');
    const user = await db.findOne({ _id: new ObjectId(user_id) });
    return user;
  } catch (error) {
    return {
      success: false,
      mgs: 'Có lỗi xảy ra xin thử được sau',
    };
  }
};
const validateBeforeUpdate = async (data) => {
  return await UPDATE_USER.validateAsync(data, { abortEarly: false });
};

const update = async (id, data) => {
  try {
    await validateBeforeUpdate(data);
    const result = await GET_DB()
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' }
      );
    delete result.password;
    return result;
  } catch (error) {
    return {
      error: true,
    };
  }
};

const deleteUser = async (id) => {
  try {
    const result = await GET_DB()
      .collection('users')
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    return {
      error: true,
    };
  }
};

export const userModel = {
  getUserAll,
  register,
  getUserEmail,
  getUserID,
  update,
  countUserAll,
  deleteUser,
};
