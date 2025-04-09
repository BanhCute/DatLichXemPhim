const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Khởi tạo express app
const app = express();

// Middleware
app.use(cors()); // Cho phép frontend gọi API
app.use(express.json()); // Parse JSON request body

// Import routes
const authRoutes = require("./routes/authRoute");
const movieRoutes = require("./routes/movieRoute");
const showTimeRoutes = require("./routes/showTimeRoute");
const bookingRoutes = require("./routes/bookingRoute");
const reviewRoutes = require("./routes/reviewRoute");
const genreRoutes = require("./routes/genreRoute");
const movieGenreRoutes = require("./routes/movieGenreRoute");
const paymentRoutes = require("./routes/paymentRoute");
const promotionRoutes = require("./routes/promotionRoute");

// Đăng ký routes
app.use("/api/auth", authRoutes); // Các API liên quan đến auth
app.use("/api/movies", movieRoutes); // Các API liên quan đến phim
app.use("/api/showtimes", showTimeRoutes); // Các API liên quan đến suất chiếu
app.use("/api/bookings", bookingRoutes); // Các API liên quan đến đặt vé
app.use("/api/reviews", reviewRoutes); // Các API liên quan đến đánh giá
app.use("/api/genres", genreRoutes); // Các API liên quan đến thể loại phim
app.use("/api/movie-genres", movieGenreRoutes); // Các API liên quan đến thể loại phim
app.use("/api/payments", paymentRoutes); // Các API liên quan đến thanh toán
app.use("/api/promotions", promotionRoutes); // Các API liên quan đến khuyến mãi

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
