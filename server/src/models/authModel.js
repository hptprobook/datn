import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
    SAVE_USER_SCHEMA,
    UPDATE_USER,
    SAVE_USER_SOCIAL,
} from '~/utils/schema/authSchema';

const validateBeforeCreate = async (data) => {
    return await SAVE_USER_SCHEMA.validateAsync(data, { abortEarly: false });
};
const validateBeforeCreateSocial = async (data) => {
    return await SAVE_USER_SOCIAL.validateAsync(data, { abortEarly: false });
};

const register = async (dataUser) => {
    const validData = await validateBeforeCreate(dataUser);
    const db = await GET_DB().collection('users');
    const result = await db.insertOne(validData);
    return db.findOne({ _id: result.insertedId });
};
const registerSocial = async (dataSocial) => {
    const validData = await validateBeforeCreateSocial(dataSocial);
    const db = await GET_DB().collection('users');
    const result = await db.insertOne(validData);
    return db.findOne({ _id: result.insertedId });
};

const getUserEmail = async (email) => {
    const db = await GET_DB();
    const collection = db.collection('users');
    const user = await collection.findOne({ email });
    return user;
};

const findUserID = async (user_id) => {
    const db = await GET_DB().collection('users');
    const user = await db.findOne({ _id: new ObjectId(user_id) });
    return user;
};
const validateBeforeUpdate = async (data) => {
    return await UPDATE_USER.validateAsync(data, { abortEarly: false });
};

const update = async (id, data) => {
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
};

const updateByEmail = async (email, otp) => {
    const result = await GET_DB()
        .collection('users')
        .updateOne({ email: email }, { $set: { otp: otp } });
    return result;
};

const deleteUser = async (id) => {
    const result = await GET_DB()
        .collection('users')
        .deleteOne({ _id: new ObjectId(id) });
    return result;
};

export const authModel = {
    register,
    getUserEmail,
    // getUserID,
    update,
    deleteUser,
    updateByEmail,
    findUserID,
    registerSocial,
    // getUserRT,
};
