import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
    SAVE_WEBBANNER,
    UPDATE_WEBBANNER,
} from '~/utils/schema/webBannerSchema';

const validateBeforeCreate = async (data) => {
    return await SAVE_WEBBANNER.validateAsync(data, { abortEarly: false });
};

const getWebBanner = async () => {
    const db = await GET_DB().collection('webbanner');
    const result = await db.find().toArray();
    return result;
};
const findWebBannerByID = async (id) => {
    const db = await GET_DB().collection('webbanner');
    const result = await db.findOne({ _id: new ObjectId(id) });
    return result;
};

const createWebBanner = async (dataWebBanner) => {
    const validData = await validateBeforeCreate(dataWebBanner);
    const db = await GET_DB();
    const collection = db.collection('webbanner');
    const result = await collection.insertOne({
        ...validData,
    });
    return result;
};

const validateBeforeUpdate = async (data) => {
    return await UPDATE_WEBBANNER.validateAsync(data, { abortEarly: false });
};

const updateWebBanner = async (id, dataWebBanner) => {
    await validateBeforeUpdate(dataWebBanner);
    const db = await GET_DB();
    const collection = db.collection('webbanner');
    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dataWebBanner },
        { returnDocument: 'after' }
    );
    return result;
};

const deleteWebBanner = async (id) => {
    const db = GET_DB().collection('webbanner');
    const result = await db.deleteOne({ _id: new ObjectId(id) });
    return result;
};

export const webBannerModel = {
    getWebBanner,
    createWebBanner,
    updateWebBanner,
    deleteWebBanner,
    findWebBannerByID,
};
