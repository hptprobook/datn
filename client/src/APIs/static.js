import request from '~/config/axiosConfig';

export const getStaticPageContent = async ({ slug }) => {
  try {
    const response = await request.get(`/static-pages/${slug}?by=slug`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
