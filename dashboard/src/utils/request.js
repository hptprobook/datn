import axios from 'axios';
import { handleToast } from 'src/hooks/toast';

const baseURL = import.meta.env.VITE_REACT_API_URL;

// Function to get the access token from local storage
const getAccessToken = () => localStorage.getItem('token');

const request = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`, // Initial value
  },
});

// Intercept requests and update the Authorization header
request.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});
request.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kiểm tra nếu lỗi là 401
    if (error.response && error.response.status === 401) {
      handleToast('error', 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      setTimeout(() => {
        window.location.href = `login`;
      }, 1000);
    }
    return Promise.reject(error);
  }
);

// Upload method to send files
export const upload = async ({ path, file, type = 'post', additionalData = {} }) => {
  const formData = new FormData();
  formData.append(file.name, file.file);

  // Serialize additionalData if necessary
  Object.keys(additionalData).forEach((key) => {
    const value = additionalData[key];
    if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  // Kiểm tra xem phương thức HTTP có hợp lệ không
  if (!['get', 'post', 'put', 'patch', 'delete'].includes(type)) {
    throw new Error(`Invalid request method: ${type}`);
  }

  // Gửi yêu cầu với phương thức HTTP động
  const response = await request[type](path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response.data;
};
export const uploadProduct = async ({ path, data, type = 'post' }) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      data[key].forEach((file) => {
        formData.append(key, file);
      });
    } else if (key === 'variants') {
      const convert = JSON.stringify(data[key]);
      formData.append('variants', convert);
      data[key].forEach((variant) => {
        formData.append('imageVariants', variant.image);
      });
    } else if (key === 'productType' || key === 'tags') {
      const convert = JSON.stringify(data[key]);
      formData.append(key, convert);
    } else {
      formData.append(key, data[key]);
    }
  });

  const response = await request[type](path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response.data;
};
export const updateProduct = async ({ id, data }) => {
  console.log(data);
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      data[key].forEach((file) => {
        formData.append(key, file);
      });
    } else if (key === 'productType' || key === 'tags') {
      formData.append(key, JSON.stringify(data[key]));
    } else if (key === 'variantsDelete') {
      data[key].forEach((item) => {
        formData.append('variantsDelete', item);
      });
    } else if (key === 'variants') {
      data.variants.forEach((variant, i) => {
        formData.append('variants', JSON.stringify(variant));
        formData.append('imageVariants', variant.imageAdd);
        formData.append('indexVariants', i);
        if (Array.isArray(variant.sizes)) {
          variant.sizes.forEach((size, j) => {
            formData.append(`variants[${i}].sizes[${j}]`, JSON.stringify(size));
          });
        }
      });
    } else {
      formData.append(key, data[key]);
    }
  });
  const response = await request.put(`products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response.data;
};

export const uploadOrUpdate = async ({ path, data, type = 'post', isUpdate = false }) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      data[key].forEach((file) => {
        formData.append(key, file);
      });
    } else if (key === 'tags') {
      // Convert tags to array if it's a string
      const tagsArray = Array.isArray(data[key]) ? data[key] : data[key].split(',');
      tagsArray.forEach((tag) => {
        formData.append(key, tag);
      });
    } else {
      formData.append(key, data[key]);
    }
  });

  const requestType = isUpdate ? 'put' : type;
  const response = await request[requestType](path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response.data;
};



// Các phương thức khác
export const get = async (path, options = {}) => {
  const response = await request.get(path, options);
  return response.data;
};
export const post = async (path, options = {}) => {
  const response = await request.post(path, options);
  return response.data;
};
export const put = async (path, options = {}) => {
  const response = await request.put(path, options);
  return response.data;
};
export const patch = async (path, options = {}) => {
  const response = await request.patch(path, options);
  return response.data;
};
export const del = async (path, options = {}) => {
  const response = await request.delete(path, options);
  return response.data;
};
export const delWithBody = async (path, data, options = {}) => {
  const response = await request.delete(path, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
  return response.data;
};

export default request;
