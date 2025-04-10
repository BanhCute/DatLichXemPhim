const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Received token:", token); // Debug log

    if (!token) {
      return res.status(401).json({
        message: "Không tìm thấy token xác thực",
      });
    }

    // Verify token và lưu thông tin user vào req
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Token không hợp lệ",
      });
    }

    req.user = {
      id: parseInt(decoded.id),
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

module.exports = authMiddleware;
