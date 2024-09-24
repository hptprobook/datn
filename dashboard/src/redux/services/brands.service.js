import { del, get, put, upload } from 'src/utils/request';
/* eslint-disable */

const BrandServices = {
  getAll: async () => await get('brands'),
  create: async (data) => await post('brands', data),
  createWithImage: async ({ file, data }) => await upload({
    path: 'brands',
    file: file,
    additionalData: data,
    type: 'post',
  }),
  update: async ({data, id}) => await put(`brands/${id}`, data),
  updateWithImage: async ({ file, data, id }) => await upload({
    path: `brands/${id}`,
    file: file,
    additionalData: data,
    type: 'put',
  }),
  delete: async (id) => await del(`brands/${id}`),
  getById: async (id) => await get(`brands/${id}`),
};

export default BrandServices;
