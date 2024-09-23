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
  update: async (data) => await put('brands', data),
  delete: async (id) => await del(`brands/${id}`),
  getById: async (id) => await get(`brands/${id}`),
};

export default BrandServices;
