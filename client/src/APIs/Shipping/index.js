/* eslint-disable no-console */
import shipRequest from '~/config/axiosShipConfig';

const ShopId = import.meta.env.VITE_GHN_SHOP_ID;

export const getShippingFee = async (data) => {
  try {
    const response = await shipRequest.post('/shipping-order/fee', data);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy phí vận chuyển:', error);
    throw error;
  }
};

export const getServiceId = async (data) => {
  try {
    const response = await shipRequest.post(
      '/shipping-order/available-services',
      { ...data, shop_id: ShopId }
    );
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy phí vận chuyển:', error);
    throw error;
  }
};

export const getOrderDetail = async (data) => {
  try {
    const response = await shipRequest.post('/shipping-order/soc', data);
    return response.data;
  } catch (error) {
    console.error('Xảy ra lỗi khi lấy phí vận chuyển:', error);
    throw error;
  }
};
