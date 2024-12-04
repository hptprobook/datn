import request from '~/config/axiosConfig';

export const increaseProductView = async (data) => {
  try {
    const response = await request.get(`/products/${data.slug}/views`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBestViewProduct = async () => {
  try {
    const response = await request.get('/products/getByViews');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllWarehouses = async () => {
  try {
    const response = await request.get('/warehouses');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllVariants = async () => {
  try {
    const response = await request.get('/variants');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
