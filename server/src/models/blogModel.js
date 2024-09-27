import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_BLOG, UPDATE_BLOG } from '~/utils/schema/blogSchema';

const validateBeforeCreate = async (data) => {
    return await SAVE_BLOG.validateAsync(data, { abortEarly: false });
};

const getAllBlogs = async (page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('blogs');
    const result = await db
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .project({
            productsList: 0, // Loại bỏ trường "unnecessaryField1"
            note: 0, // Loại bỏ trường "unnecessaryField2"
        })
        // .project({ _id: 0, age:1 })
        .toArray();
    return result;
};

const findBlogByID = async (id) => {
    const db = await GET_DB().collection('blogs');
    const result = await db.findOne({ _id: new ObjectId(id) });
    return result;
};

const createBlog = async (dataBlog) => {
    const validData = await validateBeforeCreate(dataBlog);
    const db = await GET_DB();
    const collection = db.collection('blogs');
    const data = {
        ...validData,
        authID: new ObjectId(dataBlog.authID),
    };
    const result = await collection.insertOne(data);
    return result;
};

const validateBeforeUpdate = async (data) => {
    return await UPDATE_BLOG.validateAsync(data, { abortEarly: false });
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

const deleteBlog = async (id) => {
    const db = GET_DB().collection('blogs');
    const result = await db.deleteOne({ _id: new ObjectId(id) });
    return result;
};

export const blogModel = {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    findBlogByID,
};
