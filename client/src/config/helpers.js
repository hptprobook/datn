/* eslint-disable no-console */
import { handleToast } from '~/customHooks/useToast';

export const handleApiError = (error) => {
  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    'Đã xảy ra lỗi. Vui lòng thử lại sau.';

  handleToast('error', errorMessage);

  console.error('API Error:', error);
};
