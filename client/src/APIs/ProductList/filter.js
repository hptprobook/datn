/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const filterProductsWithPriceRange = async ({
  slug,
  limit = 20,
  minPrice,
  maxPrice,
  colors,
  sizes,
  type,
  tags,
  sortOption,
} = {}) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      minPrice: minPrice?.toString() || '',
      maxPrice: maxPrice?.toString() || '',
    });

    if (colors && colors.length > 0) {
      params.append('colors', colors.join(','));
    }

    if (sizes && sizes.length > 0) {
      params.append('sizes', sizes.join(','));
    }

    if (type) {
      params.append('type', type);
    }

    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }

    if (sortOption) {
      const [key, value] = sortOption.split('-');
      params.append(key, value);
    }

    const response = await request.get(
      `/products/filter/${slug}?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lọc sản phẩm với slug danh mục:', slug);
    throw error;
  }
};

export const filterProductsWithSearch = async ({
  keyword,
  limit = 20,
  minPrice,
  maxPrice,
  colors,
  sizes,
  sortOption,
} = {}) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    });

    if (colors && colors.length > 0) {
      params.append('colors', colors.join(','));
    }

    if (sizes && sizes.length > 0) {
      params.append('sizes', sizes.join(','));
    }

    if (sortOption) {
      const [key, value] = sortOption.split('-');
      params.append(key, value);
    }

    const response = await request.get(
      `/products/search/keyword?keyword=${keyword}&${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lọc sản phẩm với từ khóa:', keyword);
    throw error;
  }
};

export const getMinMaxPrices = async () => {
  try {
    const response = await request.get('/products/price-range');
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy khoảng giá sản phẩm:', error);
    throw error;
  }
};
