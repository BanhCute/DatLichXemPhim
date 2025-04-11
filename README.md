# 🎬 Dự Án Đặt Lịch Xem Phim

[![Status](https://img.shields.io/badge/Status-Đang%20Phát%20Triển-brightgreen)](https://github.com/BanhCute/DatLichXemPhim)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-green)](https://nodejs.org/)
[![Neon](https://img.shields.io/badge/Database-Neon%20(PostgreSQL)-purple)](https://neon.tech/)

**Dự Án Đặt Lịch Xem Phim** là một ứng dụng web cho phép người dùng tìm kiếm, xem thông tin phim, đặt lịch xem phim và quản lý vé. Ứng dụng được xây dựng với **React** cho phần giao diện người dùng (frontend), **Node.js** và **Express** cho phần server (backend), và sử dụng **Neon** (dịch vụ PostgreSQL serverless) làm cơ sở dữ liệu.

---

## 📋 Tổng Quan Dự Án

Ứng dụng cung cấp các tính năng chính:
- **Tìm kiếm phim**: Tìm kiếm phim theo tên hoặc thể loại.
- **Xem chi tiết phim**: Hiển thị thông tin chi tiết (mô tả, thời lượng, thể loại, v.v.).
- **Đặt lịch xem phim**: Chọn suất chiếu và đặt vé.
- **Quản lý vé**: Quản lý thông tin vé đã đặt (yêu cầu đăng nhập).
- **Quản lý phim và suất chiếu**: Admin có thể thêm, sửa, xóa phim và lịch chiếu.

### Cấu trúc dự án
- **`frontend/`**: Mã nguồn giao diện người dùng (React).
- **`backend/`**: Mã nguồn server (Node.js, Express).
- **`package.json`**: Quản lý dependencies của dự án.
- **`.gitignore`**: Định nghĩa các tệp/thư mục bỏ qua khi đẩy lên Git.

---

## 🛠️ Công Nghệ Sử Dụng

| **Phần**                  | **Công Nghệ**                     |
|---------------------------|-----------------------------------|
| **Frontend**              | React, Material-UI                |
| **Backend**               | Node.js, Express, Multer          |
| **Database**              | Neon (PostgreSQL serverless)      |
| **Quản lý Dependencies**  | npm                               |

---

## 📦 Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:
- **Node.js** (phiên bản 16.x hoặc cao hơn).
- **npm** (thường đi kèm với Node.js).
- Tài khoản **Neon** để quản lý cơ sở dữ liệu PostgreSQL.
- Trình duyệt web (Chrome, Firefox, v.v.).
- (Tùy chọn) **pgAdmin** hoặc công cụ quản lý PostgreSQL để kiểm tra cơ sở dữ liệu.

---

## 🚀 Hướng Dẫn Cài Đặt

Dưới đây là các bước chi tiết để thiết lập dự án sau khi clone từ repository:

### 1. Clone Dự Án
Clone mã nguồn từ repository:
```bash
git clone https://github.com/BanhCute/DatLichXemPhim.git
cd DatLichXemPhim
```

### 2. Cài Đặt Dependencies
Dự án có hai phần chính: **frontend** và **backend**. Bạn cần cài đặt dependencies cho cả hai.

#### Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Nếu `npm install` không cài đầy đủ, hãy đảm bảo cài thêm các thư viện sau:
   ```bash
   npm install multer mongoose dotenv pg
   ```
   - **`multer`**: Xử lý upload file (có thể dùng để upload hình ảnh phim).
   - **`mongoose`**: ORM cho MongoDB (nếu dự án dùng MongoDB thay vì hoặc kết hợp với Neon/PostgreSQL).
   - **`dotenv`**: Quản lý biến môi trường.
   - **`pg`**: Thư viện để kết nối với PostgreSQL.

4. Tạo tệp `.env` trong thư mục `backend` và cấu hình các biến môi trường:
   ```env
   PORT=5000
   DATABASE_URL=<your-neon-postgresql-url>
   MONGO_URI=<your-mongodb-uri> # Nếu dùng MongoDB
   ```
   - Lấy `DATABASE_URL` từ bảng điều khiển Neon.
   - Nếu dùng MongoDB, lấy `MONGO_URI` từ MongoDB Atlas hoặc local MongoDB.

#### Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. (Tùy chọn) Nếu gặp lỗi liên quan đến Material-UI, thử cài thêm:
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   ```

### 3. Cấu Hình Cơ Sở Dữ Liệu
- **Neon (PostgreSQL)**:
  1. Đăng nhập vào tài khoản Neon, tạo một dự án và lấy chuỗi kết nối (connection string).
  2. Cập nhật chuỗi kết nối vào tệp `.env` của backend (xem bước 2).
  3. Tạo các bảng cần thiết (phim, suất chiếu, vé, người dùng, v.v.) bằng cách chạy các script SQL (nếu có trong dự án) hoặc sử dụng công cụ như pgAdmin.
- **MongoDB (nếu sử dụng)**:
  1. Đảm bảo MongoDB đang chạy (local hoặc trên Atlas).
  2. Cập nhật `MONGO_URI` trong `.env`.

### 4. Chạy Ứng Dụng

#### Backend
Trong thư mục `backend`, khởi động server:
```bash
npm start
```
Server sẽ chạy tại `http://localhost:5000`. Kiểm tra API bằng cách truy cập một endpoint (nếu có), ví dụ: `http://localhost:5000/api/movies`.

#### Frontend
Trong thư mục `frontend`, chạy ứng dụng React:
```bash
npm start
```
Ứng dụng sẽ mở tại `http://localhost:3000` trong trình duyệt.

### 5. Kiểm Tra Cơ Sở Dữ Liệu
- **Neon**: Sử dụng bảng điều khiển Neon hoặc pgAdmin để kiểm tra kết nối và dữ liệu.
- **MongoDB**: Sử dụng MongoDB Compass hoặc lệnh `mongo` để kiểm tra.

---

## 🛠️ Các Lệnh Thường Dùng

| **Lệnh**                | **Mô Tả**                                    |
|-------------------------|----------------------------------------------|
| `npm install`           | Cài đặt dependencies trong thư mục hiện tại. |
| `npm start` (backend)   | Khởi động server backend.                   |
| `npm start` (frontend)  | Khởi động ứng dụng React.                   |
| `npm run build` (frontend) | Build ứng dụng React cho production.      |

---

## ⚠️ Lưu Ý Khi Clone Dự Án
1. **Thiếu Dependencies**: Nếu `npm install` không cài hết thư viện, kiểm tra `package.json` trong cả `frontend` và `backend` để đảm bảo tất cả thư viện được liệt kê. Các thư viện phổ biến bị thiếu có thể bao gồm:
   - Backend: `multer`, `mongoose`, `dotenv`, `pg`.
   - Frontend: `@mui/material`, `@emotion/react`, `@emotion/styled`.
2. **Tệp `.env`**: Tệp này không được đẩy lên Git (do `.gitignore`). Bạn phải tạo lại `.env` với các biến môi trường cần thiết.
3. **Kết Nối Cơ Sở Dữ Liệu**: Đảm bảo chuỗi kết nối database (Neon hoặc MongoDB) chính xác.
4. **Phiên Bản Node.js**: Sử dụng Node.js 16.x hoặc cao hơn để tránh lỗi tương thích.

---

## ❓ Khắc Phục Sự Cố
- **Lỗi `npm install`**:
  - Xóa thư mục `node_modules` và tệp `package-lock.json`, sau đó chạy lại `npm install`.
  - Cài thủ công các thư viện bị thiếu (ví dụ: `npm install multer mongoose`).
- **Lỗi Kết Nối Database**:
  - Kiểm tra chuỗi kết nối trong `.env`.
  - Đảm bảo Neon hoặc MongoDB đang hoạt động.
- **Lỗi Frontend Không Hiển Thị**:
  - Kiểm tra console trình duyệt để xem lỗi (F12 > Console).
  - Đảm bảo backend đang chạy và API trả về dữ liệu đúng.

---

## 📢 Góp Ý
Nếu bạn gặp vấn đề hoặc muốn bổ sung tính năng, hãy tạo issue trên repository hoặc liên hệ nhóm phát triển.

---

## 👥 Đóng Góp
- [BanhCute](https://github.com/BanhCute)
- [NguyenTanQuoc](https://github.com/NguyenTanQuoc)
- [Lawrence-Miyato](https://github.com/Lawrence-Miyato)
- [namtrh183](https://github.com/namtrh183)

---

**Dự Án Đặt Lịch Xem Phim** được phát triển bởi nhóm sinh viên với mục tiêu học tập và thực hành công nghệ web. Cảm ơn bạn đã quan tâm! 🎥
