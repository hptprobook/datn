# BMT Life - Client

Website bán hàng BMT Life - Phần client

## Yêu cầu hệ thống

- Node.js 16.x trở lên
- npm hoặc yarn
- Git

## Cài đặt

1. Clone repository:

```bash
git clone https://github.com/hptprobook/datn.git
cd datn/client
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
VITE_API_ROOT='http://localhost:3000/api'
VITE_SERVER_URL='http://localhost:3000'
VITE_DOMAIN='http://localhost:5173'
VITE_GHN_SHOP_ID='<your_ghn_shop_id>'
VITE_GHN_TOKEN='<your_ghn_token>'
VITE_GHN_URL='https://online-gateway.ghn.vn/shiip/public-api/v2'
```

4. Chạy project:

```bash
npm run dev
```

hoặc  

```bash
yarn dev
```

Ứng dụng sẽ chạy trên `http://localhost:5173`

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
  - `assets/`: Chứa các file tĩnh như hình ảnh, video, ...
  - `APIs/`: Chứa các file API của ứng dụng
  - `components/`: Chứa các component dùng chung cho ứng dụng
  - `pages/`: Chứa các trang của ứng dụng
  - `utils/`: Chứa các hàm tiện ích dùng chung cho ứng dụng
  - `config/`: Chứa cấu hình của ứng dụng
  - `hooks/`: Chứa các hook dùng chung cho ứng dụng
  - `layouts/`: Chứa các layout dùng chung cho ứng dụng
  - `routes/`: Chứa các route của ứng dụng
  - `contexts/`: Chứa các context của ứng dụng
  - `App.jsx`: File chính của ứng dụng
  - `main.jsx`: File khởi tạo ứng dụng
- `public/`: Chứa các file tĩnh như `robots.txt`, `favicon.ico`,...

## Tính năng chính

- Đăng nhập/Đăng ký (Local + Google)
- Quản lý tài khoản, giỏ hàng, đơn hàng
- Xem thông tin cửa hàng
- Xem danh mục sản phẩm, chi tiết sản phẩm
- Đặt hàng, thanh toán
- Theo dõi đơn hàng
- Bình luận sản phẩm sau khi mua
- Chat với BOT
- Tin tức, bài viết
- Tìm kiếm sản phẩm, tin tức
- Lọc sản phẩm, tin tức
- Tag tin tức
- Xử lý lại tracking đơn hàng
- Bộ lọc thông báo người dùng

## Công nghệ sử dụng

- React + Vite
- React Router Dom
- Tailwind CSS
- Socket.IO
- React Query
- Axios