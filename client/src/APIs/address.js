/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getAllProvinces = async () => {
  try {
    const response = await request.get('/address/tinh');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy tất cả tỉnh thành:', error);
    throw error;
  }
};

export const getDistrictsByProvinceId = async (provinceId) => {
  try {
    const response = await request.get(`/address/huyen/${provinceId}`);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy tất cả quận huyện:', error);
    throw error;
  }
};

export const getWardsByDistrictId = async (districtId) => {
  try {
    const response = await request.get(`/address/xa/${districtId}`);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy tất cả phường xã:', error);
    throw error;
  }
};
