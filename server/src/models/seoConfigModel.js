import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
    SAVE_SEOCONFIG,
    UPDATE_SEOCONFIG,
} from '~/utils/schema/seoConfigSchema';

const validateBeforeCreate = async(data) => {
    return await SAVE_SEOCONFIG.validateAsync(data, { abortEarly: false });
};

const getSeoConfig = async() => {
    try {
        const db = await GET_DB().collection('seo');
        const result = await db.findOne();
        return result;
    } catch (error) {
        return {
            mgs: 'Có lỗi xảy ra xin thử lại sau',
        };
    }
};

const createSeo = async(dataSeo) => {
    const validData = await validateBeforeCreate(dataSeo);
    const db = await GET_DB();
    const collection = db.collection('seo');
    const result = await collection.insertOne({
        ...validData,
    });
    return result;
};

const validateBeforeUpdate = async(data) => {
    return await UPDATE_SEOCONFIG.validateAsync(data, { abortEarly: false });
};

const updateSeo = async(id, dataSeo) => {
    const validData = await validateBeforeUpdate(dataSeo);
    const db = await GET_DB();
    const collection = db.collection('seo');
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: validData }, { returnDocument: 'after' });
    return result;
};

// const deleteSeoConfig = async(id) => {
//     try {
//         const db = GET_DB().collection('seo');
//         const result = await db.deleteOne({ _id: new ObjectId(id) });
//         return result;
//     } catch (error) {
//         if (error.details) {
//             return error.details;
//         }
//         return error;
//     }
// };

export const seoConfigModel = {
    getSeoConfig,
    createSeo,
    updateSeo,
    // deleteSeoConfig,
};