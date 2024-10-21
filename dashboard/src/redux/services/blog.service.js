
import { get, del, uploadOrUpdate } from "src/utils/request";
/* eslint-disable */
const BlogsService = {
  getAllBlogs: async () => {
    try {
      const res = await get('blogs');
      return res;
    } catch (err) {
      throw err;
    }
  },
  getBlogById: async (id) => {
    try {
      return await get(`blogs/${id}`);
    } catch (err) {
      throw err;
    }
  },
  deleteBlogtById: async (id) => {
    try {
      const res = await del(`blogs/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  createBlog: async (data) => {
    try {
      const res = await uploadOrUpdate({
        data,
        type: 'post',
        path: 'blogs',
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateBlog: async (id, data) => {
    try {
      const res = await uploadOrUpdate({
        data,
        isUpdate: true,
        path: `blogs/${id}`,
      });
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

export default BlogsService;
