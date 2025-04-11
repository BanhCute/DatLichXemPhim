# 🎬 Dự Án Đặt Lịch Xem Phim

![Banner](https://img.shields.io/badge/Status-Đang%20Phát%20Triển-brightgreen)  
![React](https://img.shields.io/badge/Frontend-React-blue)  
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-green)  
![Neon](https://img.shields.io/badge/Database-Neon%20(PostgreSQL)-purple)

**Dự Án Đặt Lịch Xem Phim** là một ứng dụng web cho phép người dùng tìm kiếm, xem thông tin phim, đặt lịch xem phim và quản lý vé. Ứng dụng được xây dựng với **React** cho phần giao diện người dùng (frontend), **Node.js** và **Express** cho phần server (backend), và sử dụng **Neon** (dịch vụ PostgreSQL serverless) làm cơ sở dữ liệu.

---

## 📋 Tổng Quan Dự Án

Ứng dụng này cung cấp các tính năng chính như:
- **Tìm kiếm phim**: Người dùng có thể tìm kiếm phim theo tên hoặc thể loại.
- **Xem chi tiết phim**: Hiển thị thông tin chi tiết về phim (mô tả, thời lượng, thể loại, v.v.).
- **Đặt lịch xem phim**: Người dùng có thể chọn suất chiếu và đặt vé.
- **Quản lý vé**: Quản lý thông tin vé đã đặt (dành cho người dùng đăng nhập).
- **Quản lý phim và suất chiếu**: Admin có thể thêm, sửa, xóa phim và lịch chiếu.

### Cấu trúc dự án
- **`frontend/`**: Chứa mã nguồn giao diện người dùng, xây dựng bằng React.
- **`backend/`**: Chứa mã nguồn server, xây dựng bằng Node.js và Express.
- **`package.json`**: Quản lý dependencies của dự án.
- **`.gitignore`**: Định nghĩa các tệp/thư mục bỏ qua khi đẩy lên Git.

---

## 🛠️ Công Nghệ Sử Dụng

| **Phần**         | **Công Nghệ**              |
|------------------|----------------------------|
| **Frontend**     | React, Material-UI         |
| **Backend**      | Node.js, Express           |
| **Database**     | Neon (PostgreSQL serverless) |
| **Quản lý Dependencies** | npm                  |

---

## 📦 Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau:
- **Node.js** (phiên bản 16.x hoặc cao hơn)  
- **npm** (thường đi kèm với Node.js)  
- Một tài khoản **Neon** để quản lý cơ sở dữ liệu PostgreSQL  
- Trình duydev
```
Server sẽ chạy tại `http://localhost:5000`.

#### Frontend
Trong thư mục `frontend`, chạy ứng dụng React:
```bash
npm start
```
Ứng dụng sẽ tự động mở trong trình duyệt tại `http://localhost:3000`.

### 5. Kiểm Tra Cơ Sở Dữ Liệu
- Đảm bảo bạn đã tạo cơ sở dữ liệu trên Neon và kết nối thành công.
- Sử dụng công cụ như **pgAdmin** hoặc chạy các lệnh SQL trực tiếp trên bảng điều khiển của Neon để kiểm tra.

---

## 🛠️ Các Lệnh
