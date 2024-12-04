import request from '~/config/axiosConfig';

export const getCouponsForOrder = async () => {
  try {
    const response = await request.get('/coupons/getForOrder');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const checkAbleCoupon = async (couponCode, amount) => {
  try {
    const response = await request.post('/coupons/check-applicability', {
      code: couponCode,
      purchaseAmount: amount,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
