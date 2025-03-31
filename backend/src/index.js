const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Khởi tạo express app
const app = express();

// Middleware
app.use(cors()); // Cho phép frontend gọi API
app.use(express.json()); // Parse JSON request body

// Import routes
const authRoutes = require("./routes/auth.routes");
const movieRoutes = require("./routes/movie.routes");
const showTimeRoutes = require("./routes/showTime.routes");
const bookingRoutes = require("./routes/booking.routes");

// Đăng ký routes
app.use("/api/auth", authRoutes); // Các API liên quan đến auth
app.use("/api/movies", movieRoutes); // Các API liên quan đến phim
app.use("/api/showtimes", showTimeRoutes); // Các API liên quan đến suất chiếu
app.use("/api/bookings", bookingRoutes); // Các API liên quan đến đặt vé

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
