var express = require("express");
var router = express.Router();
const { CreateSuccessRes } = require("../utils/responseHandler");
const { CheckAuth } = require("../utils/check_auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Sửa lại đường dẫn tuyệt đối
const uploadDir = path.join(
  __dirname,
  "../../../frontend/public/images/movies"
);
console.log("Upload directory:", uploadDir); // Log để debug

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Created directory:", uploadDir);
  } catch (error) {
    console.error("Error creating directory:", error);
  }
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Kiểm tra lại thư mục tồn tại trước khi upload
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Giữ tên file gốc để dễ quản lý
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh!"));
    }
  },
});

router.post("/", CheckAuth, (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      return next(err);
    }

    try {
      if (!req.file) {
        throw new Error("Không có file được upload");
      }

      // Kiểm tra file đã được tạo thành công
      const filePath = path.join(uploadDir, req.file.filename);
      if (!fs.existsSync(filePath)) {
        throw new Error("File không được tạo thành công");
      }

      console.log("File uploaded successfully:", filePath);

      CreateSuccessRes(
        res,
        {
          path: `/images/movies/${req.file.filename}`,
        },
        201
      );
    } catch (error) {
      console.error("Upload error:", error);
      next(error);
    }
  });
});

module.exports = router;
