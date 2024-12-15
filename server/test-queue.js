const { default: axios } = require('axios');
const { random } = require('lodash');

const numRequests = 100;

const apiUrl = 'http://localhost:3000/api/orders';

const requestBody = {
  orderCode: random(100000, 999999).toString(),
  productsList: [
    {
      _id: '6729d005ebe9cd231162d741',
      quantity: 1,
      image:
        '//product.hstatic.net/200000584505/product/img_8034-edit_1c5d3a8705324b31ae65b43277b11931_master.jpg',
      name: 'Áo khoác nón',
      slug: 'ao-khoac-non',
      sku: 'AOKHOACNONXANHLACAYL',
      weight: 43,
      price: 847124,
      variantColor: 'Xanh lá cây',
      variantSize: 'L',
      itemTotal: 847124,
    },
  ],
  shippingInfo: {
    provinceName: 'Lai Châu',
    districtName: 'Huyện Tam Đường',
    districtCode: 2010,
    wardName: 'Xã Bản Bo',
    wardCode: '70202',
    detailAddress: '45 Nguyễn Viết Xuân',
    phone: '0332741249',
    name: 'Phan Hoa',
    fullAddress: '45 Nguyễn Viết Xuân, Xã Bản Bo, Huyện Tam Đường, Lai Châu',
  },
  email: 'hptprobook@gmail.com',
  totalPrice: 847124,
  totalPayment: 883125,
  shippingType: 'cod',
  fee: 36001,
  couponId: [],
  discountPrice: 0,
  paymentMethod: 'Tiền mặt',
};

const headers = {
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjZlNzhhNTM5MTMzYmIzNzIwNWI5OTk4IiwiZW1haWwiOiJocHRwcm9ib29rQGdtYWlsLmNvbSIsInJvbGUiOiJyb290IiwiaWF0IjoxNzM0MjM2OTEwLCJleHAiOjE3MzQyNTg1MTB9.ppygNxvqs_5IYGXAPTMwLzQSo8lUVA4D7Uq_8pkmVSE',
  'Content-Type': 'application/json',
};

const sendRequest = async () => {
  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    console.log(`Success: ${response.status} - ${response.data.message}`);
  } catch (error) {
    console.error(
      `Error: ${error.response?.status || 500} - ${
        error.response?.data?.message || 'Unknown error'
      }`
    );
  }
};

// Gửi nhiều request đồng thời
(async () => {
  const requests = Array.from({ length: numRequests }, () => sendRequest());
  await Promise.all(requests);
  console.log('Tất cả request đã được gửi');
})();
