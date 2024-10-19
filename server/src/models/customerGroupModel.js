import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
    SAVE_CUSTOMER_GROUP,
    UPDATE_CUSTOMER_GROUP,
} from '~/utils/schema/CustomerGroupSchema';

const validateBeforeCreate = async (data) => {
    return await SAVE_CUSTOMER_GROUP.validateAsync(data, { abortEarly: false });
};

const getAllCG = async (page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('customerGroup');
    const result = await db
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        // .project({ _id: 0, age:1 })
        .toArray();
    return result;
};

const findBlogByID = async (id) => {
    const db = await GET_DB().collection('blogs');
    const result = await db.findOne({ _id: new ObjectId(id) });
    return result;
};

const findBlogAuthID = async (authID, page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('blogs');
    const result = await db
        .find({ authID: new ObjectId(authID) })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    return result;
};
const findBlogByStatus = async (status, page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('blogs');
    const result = await db
        .find({ status })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    return result;
};
const findBlogBySlug = async (slug) => {
    const db = await GET_DB().collection('blogs');
    const result = await db.findOne({ slug });
    return result;
};
const findBlogByTitle = async (title, page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('blogs');
    const result = await db
        .find({ title: { $regex: title, $options: 'i' } })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    return result;
};

const createCG = async (dataCG) => {
    const validData = await validateBeforeCreate(dataCG);
    const db = await GET_DB();
    const collection = db.collection('customerGroup');
    const result = await collection.insertOne(validData);
    return result;
};

const validateBeforeUpdate = async (data) => {
    return await UPDATE_CUSTOMER_GROUP.validateAsync(data, {
        abortEarly: false,
    });
};

const updateBlog = async (id, dataBlog) => {
    const data = await validateBeforeUpdate(dataBlog);
    const db = await GET_DB();
    const collection = db.collection('blogs');
    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' }
    );
    return result;
};

const validateBeforeUpdateComment = async (data) => {
    return await UPDATE_CUSTOMER_GROUP.validateAsync(data, {
        abortEarly: false,
    });
};
// comment
const updateComment = async (id, dataComment) => {
    const data = await validateBeforeUpdateComment(dataComment);
    const newData = { ...data, userId: new ObjectId(data.userId) };
    const db = await GET_DB();
    const collection = db.collection('blogs');
    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { comments: newData } },
        { returnDocument: 'after' }
    );
    return result;
};
const delComment = async (id, commentId) => {
    const db = await GET_DB();
    const collection = db.collection('blogs');
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $pull: { comments: { commentId: commentId } } },
        { returnDocument: 'after' }
    );
    return result;
};

const updateViews = async (id) => {
    const db = await GET_DB();
    const collection = db.collection('blogs');
    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $inc: {
                views: 1,
            },
        },
        { returnDocument: 'after' }
    );
    return result;
};

const deleteBlog = async (id) => {
    const db = GET_DB().collection('blogs');
    const result = await db.deleteOne({ _id: new ObjectId(id) });
    return result;
};

export const customerGroupModel = {
    getAllCG,
    createCG,

    updateBlog,
    deleteBlog,
    findBlogByID,
    updateViews,
    findBlogBySlug,
    findBlogByStatus,
    findBlogAuthID,
    updateComment,
    delComment,
    findBlogByTitle,
};
