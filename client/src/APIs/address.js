import request from '~/config/axiosConfig';

export const getCoordinatesFromAddress = async (address) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=pk.eyJ1IjoiaHB0cHJvYm9vayIsImEiOiJjbTNpNWh3dnAwbWtsMmxwczg1ZGJkM3F4In0.PuW_eg-H7l6VT58DWbgbTw`
  );
  const data = await response.json();
  return data.features[0].geometry.coordinates; // Trả về [longitude, latitude]
};

export const getAllProvinces = async () => {
  try {
    const response = await request.get('/address/tinh');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDistrictsByProvinceId = async (provinceId) => {
  try {
    const response = await request.get(`/address/huyen/${provinceId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWardsByDistrictId = async (districtId) => {
  try {
    const response = await request.get(`/address/xa/${districtId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
