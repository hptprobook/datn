import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_BLOG,
  UPDATE_BLOG,
  UPDATE_COMMENT,
} from '~/utils/schema/blogSchema';
import { generateSlug } from '~/utils/format';
const validateBeforeCreate = async (data) => {
  return await SAVE_BLOG.validateAsync(data, { abortEarly: false });
};

const getAllBlogs = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('blogs');
  const count = await db.countDocuments();
  const result = await db
    .find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    // .project({ _id: 0, age:1 })
    .toArray();
  return {
    data: result,
    count,
  };
};

const getTagsFromBlogs = async () => {
  const db = await GET_DB().collection('blogs');

  const tags = await db
    .aggregate([
      { $match: { status: 'public' } }, // Chỉ lấy các blog có trạng thái 'public'
      { $unwind: '$tags' }, // Tách mảng tags thành các phần tử riêng lẻ
      { $group: { _id: '$tags', count: { $sum: 1 } } }, // Gom nhóm các tags và đếm số lần xuất hiện
      { $sort: { _id: 1 } }, // Sắp xếp tags theo thứ tự chữ cái
      { $project: { _id: 0, tag: '$_id', count: 1 } }, // Chỉ trả về tag và số lần xuất hiện
    ])
    .toArray();

  return tags;
};

const getAllBlogsForClient = async ({
  page = 1,
  limit = 12,
  sort = 'newest',
  tags = '',
  search = '',
}) => {
  page = parseInt(page);
  limit = parseInt(limit);

  const db = await GET_DB().collection('blogs');

  // Tạo query cơ bản
  const query = {
    status: 'public', // Chỉ trả về các blog có trạng thái 'public'
  };

  // Lọc theo tags nếu được cung cấp
  if (tags.trim()) {
    query.tags = { $regex: tags, $options: 'i' };
  }

  // Tìm kiếm nếu có search
  if (search.trim()) {
    const searchSlug = generateSlug(search);
    query.slug = { $regex: searchSlug, $options: 'i' };
  }

  // Sắp xếp
  let sortQuery = {};
  switch (sort) {
    case 'newest':
      sortQuery = { createdAt: -1 }; // Sắp xếp bài viết mới nhất
      break;
    case 'oldest':
      sortQuery = { createdAt: 1 }; // Sắp xếp bài viết cũ nhất
      break;
    case 'mostViews':
      sortQuery = { views: -1 }; // Sắp xếp bài viết có nhiều lượt xem nhất
      break;
    default:
      sortQuery = { createdAt: -1 }; // Mặc định là mới nhất
  }

  const result = await db
    .find(query)
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return result;
};

const getTopViewBlogs = async () => {
  const db = await GET_DB().collection('blogs');
  const result = await db.find().sort({ views: -1 }).limit(6).toArray();
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

const validateBeforeUpdateComment = async (data) => {
  return await UPDATE_COMMENT.validateAsync(data, { abortEarly: false });
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
const deleteManyBlogs = async (ids) => {
  if (!Array.isArray(ids)) {
    throw new Error('Ids phải là một mảng');
  }

  const db = GET_DB().collection('blogs');

  const blogs = await db
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
    .toArray();

  if (!blogs || blogs.length === 0) {
    throw new Error('Không tìm thấy bài viết nào');
  }

  const result = await db.deleteMany({
    _id: { $in: ids.map((id) => new ObjectId(id)) },
  });

  if (result.deletedCount === 0) {
    throw new Error('Xóa không thành công');
  }

  const remainingBlogs = await db
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
    .toArray();

  const remainingIds = remainingBlogs.map((blog) => blog._id.toString());

  const deletedIds = ids.filter((id) => !remainingIds.includes(id));

  const images = blogs
    .filter((blog) => deletedIds.includes(blog._id.toString()))
    .map((blog) => blog.thumbnail);

  return {
    images,
    deletedIds,
    failedIds: remainingIds,
  };
};
const getBlogBySlug = async (slug) => {
  const db = await GET_DB().collection('blogs');
  const blog = await db.findOne({ slug: slug });
  return blog;
};

export const blogModel = {
  getAllBlogs,
  getTagsFromBlogs,
  getAllBlogsForClient,
  getTopViewBlogs,
  createBlog,
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
  getBlogBySlug,
  deleteManyBlogs
};
