/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const getAllProducts = async ({ limit = 20 } = {}) => {
  try {
    const response = await request.get(`/products?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy tất cả sản phẩm:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await request.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Xảy ra lỗi khi lấy sản phẩm bằng id: ${id}:`, error);
    throw error;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const response = await request.get(`/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Xảy ra lỗi khi lấy sản phẩm bằng slug: ${slug}:`, error);
    throw error;
  }
};

export const getProductsByCatId = async (catId, limit = 20) => {
  try {
    const response = await request.get(
      `/products/category/${catId}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Xảy ra lỗi khi lấy tất cả sản phẩm bằng id danh mục:',
      error
    );
    throw error;
  }
};

export const getProductsByCatSlug = async (slug, limit = 20) => {
  try {
    const response = await request.get(
      `/products/category/slug/${slug}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Xảy ra lỗi khi lấy tất cả sản phẩm bằng slug danh mục:',
      error
    );
    throw error;
  }
};

export const getProductsByBrandId = async (brandId, limit = 20) => {
  try {
    const response = await request.get(
      `/products/brand/${brandId}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Xảy ra lỗi khi lấy tất cả sản phẩm bằng id thương hiệu:',
      error
    );
    throw error;
  }
};

export const getProductsByBrandSlug = async (slug, limit = 20) => {
  try {
    const response = await request.get(
      `/products/brand/slug/${slug}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Xảy ra lỗi khi lấy tất cả sản phẩm bằng slug thương hiệu:',
      error
    );
    throw error;
  }
};

export const getProductsByEventSlug = async (slug, limit = 20) => {
  try {
    const response = await request.get(
      `/products/event/${slug}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lọc tất cả sản phẩm bằng slug', error);
    throw error;
  }
};

export const ratingProduct = async (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      // Thêm từng ảnh với tên field là 'images'
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    } else {
      formData.append(key, data[key]);
    }
  });

  console.log(formData);
  try {
    const response = await request.post('/products/rating', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm bình luận', error);
    throw error.response.data;
  }
};
