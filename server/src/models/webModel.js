import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { CREATE_WEB, UPDATE_WEB } from '~/utils/schema/webSchema';

const validateBeforeCreate = async (data) => {
    return await CREATE_WEB.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
    return await UPDATE_WEB.validateAsync(data, { abortEarly: false });
};

const getWeb = async () => {
    const db = await GET_DB().collection('web');
    const result = await db.findOne();
    return result;
};

const createWeb = async (dataSeo) => {
    const validData = await validateBeforeCreate(dataSeo);
    const db = await GET_DB();
    const collection = db.collection('web');
    const result = await collection.insertOne({
        ...validData,
    });
    return result;
};

const updateWeb = async (id, dataSeo) => {
    await validateBeforeUpdate(dataSeo);
    const db = await GET_DB();
    const collection = db.collection('web');
    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dataSeo },
        { returnDocument: 'after' }
    );
    return result;
};

export const webModel = {
    getWeb,
    createWeb,
    updateWeb,
};
