/* eslint-disable no-console */
import request from '~/config/axiosConfig';

export const searchProducts = async ({
  keyword,
  limit,
  minPrice,
  maxPrice,
  colors,
  sizes,
  sort,
}) => {
  try {
    const params = new URLSearchParams({
      keyword: keyword || '',
      limit: limit?.toString() || '20',
      minPrice: minPrice?.toString() || '',
      maxPrice: maxPrice?.toString() || '',
    });

    if (colors?.length) {
      params.append('colors', colors.join(','));
    }

    if (sizes?.length) {
      params.append('sizes', sizes.join(','));
    }

    if (sort) {
      params.append('sort', sort);
    }

    const response = await request.get(
      `/products/search/elasticsearch?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getHotSearch = async () => {
  try {
    const response = await request.get('/hotSearch');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
