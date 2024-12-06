# BMT Life - Dashboard

Website bán hàng BMT Life - Phần dashboard

## Yêu cầu hệ thống

- Node.js 16.x trở lên
- npm hoặc yarn
- Git

## Cài đặt

1. Clone repository:

```bash
git clone https://github.com/hptprobook/datn.git
cd datn/dashboard
```

2. Cài đặt dependencies:

```bash
npm install
```

hoặc

```bash
yarn install
```

3. Chạy lệnh để tạo file `.env` từ file `.env.example`:

```bash
cp .env.example .env
```

File `.env` cần có các biến sau:

```bash
VITE_REACT_API_URL='http://localhost:3000/api'
VITE_REACT_TOKEN_GHN='f2982490-d319-11ee-8bfa-8a2dda8ec551'
VITE_REACT_API_GHN_URL='https://dev-online-gateway.ghn.vn/shiip/public-api/master-data'
VITE_DOMAIN='http://localhost:3030/'
VITE_BACKEND_APP_URL='http://localhost:3000/'
VITE_TINYMCE_API_KEY='<your_tinymce_api_key>'
```

4. Chạy project:

```bash
npm run dev
```

hoặc  

```bash
yarn dev
```

Ứng dụng sẽ chạy trên `http://localhost:3030/`

## Build và Deploy

1. Build ứng dụng:

```bash
npm run build
```

hoặc

```bash
yarn build
```

2. Preview bản build:

```bash
npm run preview
```

hoặc

```bash
yarn preview
```

## Cấu trúc thư mục

- `src/`: Chứa source code của ứng dụng
  - `_mock/`: Chứa các file mock data
  - `assets/`: Chứa các file tĩnh như hình ảnh, video, ...
  - `components/`: Chứa các component dùng chung cho ứng dụng
  - `pages/`: Chứa các trang của ứng dụng
  - `utils/`: Chứa các hàm tiện ích dùng chung cho ứng dụng
  - `config/`: Chứa cấu hình của ứng dụng
  - `hooks/`: Chứa các hook dùng chung cho ứng dụng
  - `redux/`: Chứa các redux slice
  - `theme/`: Chứa các file theme của ứng dụng
  - `sections/`: Chứa các section dùng chung cho ứng dụng
  - `layouts/`: Chứa các layout dùng chung cho ứng dụng
  - `routes/`: Chứa các route của ứng dụng
  - `contexts/`: Chứa các context của ứng dụng
  - `app.jsx`: File chính của ứng dụng
  - `main.jsx`: File khởi tạo ứng dụng
- `public/`: Chứa các file tĩnh như `robots.txt`, `favicon.ico`,...

## Tính năng chính

- Quản lý đơn hàng, sản phẩm, tin tức, bình luận, ...
- Quản lý tài khoản, cửa hàng, người dùng
- Quản lý coupon
- Bán hàng
- Quản lý kho, nhập hàng, đơn nhập hàng, nhà cung cấp
- Quản lý website config, SEO config
- Thống kê, báo cáo
- Thông báo realtime

## Công nghệ sử dụng

- React + Vite
- React Router Dom
- MUI
- Socket.IO
- Redux Toolkit
- Axios