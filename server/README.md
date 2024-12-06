# BMT Life - Server

Website bán hàng BMT Life - Phần server

## Yêu cầu hệ thống

- Node.js 16.x trở lên
- npm hoặc yarn
- Git

## Cài đặt

1. Clone repository:

```bash
git clone https://github.com/hptprobook/datn.git
cd datn/server
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
SECRET_STAFF="<your_secret_staff>"
MONGODB_URI="<your_mongodb_uri>"
DATABASE_NAME="<your_database_name>"
HOST_URL="<your_host_url>"
WEB_URL="<your_web_url>"
SECRET="<your_secret>"
REFRESH_SECRET="<your_refresh_secret>"
URL_FE="<your_url_fe>"
EMAIL_NODEMAILER="<your_email_nodemailer>"
PASSWORD_NODEMAILER="<your_password_nodemailer>"
CLIENT_URL="<your_client_url>"
```

4. Chạy project:

```bash
npm run dev
```

hoặc  

```bash
yarn dev
```

Ứng dụng sẽ chạy trên `http://localhost:3000/`

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
  - `utils/`: Chứa các hàm tiện ích dùng chung cho ứng dụng
  - `config/`: Chứa cấu hình của ứng dụng
  - `controllers/`: Chứa các controller của ứng dụng
  - `models/`: Chứa các model của ứng dụng
  - `routes/`: Chứa các route của ứng dụng
  - `sockets/`: Chứa các socket của ứng dụng
  - `middlewares/`: Chứa các middleware của ứng dụng
  - `server.js`: File chính của ứng dụng
- `uploads/`: Chứa các file tĩnh như hình ảnh, video, ...

## Tính năng chính

- API

## Công nghệ sử dụng

- Express
- MongoDB
- Socket.IO
- Axios