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

  if (Object.keys(additionalData).length) {
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });
  }

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
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      data[key].forEach((file) => {
        formData.append(key, file);
      });
    } else if (key === 'productType' || key === 'tags' || key === 'variantsDelete') {
      formData.append(key, JSON.stringify(data[key]));
    } else if (key === 'variants') {
      data[key].forEach((variant, i) => {
        formData.append('variants', JSON.stringify(variant));
        if (variant.image instanceof File) {
          formData.append('imageVariants', variant.imageAdd);
          formData.append('indexVariants', i);
        }
        if (Array.isArray(variant.sizes)) {
          variant.sizes.forEach((size, j) => {
            formData.append(`variants[${i}].sizes[${j}]`, JSON.stringify(size)); // Hoặc bạn có thể thêm từng thuộc tính của size
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

export const uploadBlog = async ({ path, data, type = 'post' }) => {
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
  const response = await request[type](path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response.data;
};
export const updateBlog = async ({ path, data }) => {
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

  const response = await request.put(path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response.data;
};

export const uploadWebBanner = async ({ path, data, type = 'post' }) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      data[key].forEach((file) => {
        formData.append(key, file);
      });
        
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
export const updateWebBanner = async ({ path, data }) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      data[key].forEach((file) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, data[key]);
    }
  });

  const response = await request.put(path, formData, {
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

export default request;
