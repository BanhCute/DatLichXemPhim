import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Chip,
  TextField,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import TheatersIcon from "@mui/icons-material/Theaters";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MovieIcon from "@mui/icons-material/Movie";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showTimeId, selectedSeats, showTime, movieInfo, totalPrice } =
    location.state || {};

  const [promoCode, setPromoCode] = useState("");
  const [promotion, setPromotion] = useState(null);
  const [promoError, setPromoError] = useState("");

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const checkPromoCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/promotions/check/${promoCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Mã giảm giá không hợp lệ");
      }

      const data = await response.json();
      setPromotion(data.data);
      setPromoError("");
    } catch (error) {
      setPromotion(null);
      setPromoError(error.message);
    }
  };

  const calculateFinalPrice = () => {
    if (!promotion) return totalPrice;
    const discount = totalPrice * (promotion.discount / 100);
    return totalPrice - discount;
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      // Đặt vé
      const bookingResponse = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            showTimeId: showTime.id,
            seatNumbers: selectedSeats.map((seat) => seat.number),
            promotionCode: promotion?.code,
          }),
        }
      );

      const bookingData = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(bookingData.message || "Không thể đặt vé");
      }

      // Tạo payment ngay sau khi đặt vé thành công
      const paymentResponse = await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId: bookingData.data.id,
            amount: bookingData.data.totalPrice,
            method: "CASH", // hoặc có thể cho người dùng chọn phương thức
            status: "COMPLETED", // Thanh toán ngay
          }),
        }
      );

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error("Không thể tạo thanh toán");
      }

      // Cập nhật trạng thái booking thành CONFIRMED sau khi thanh toán
      const updateBookingResponse = await fetch(
        `http://localhost:5000/api/bookings/${bookingData.data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "CONFIRMED",
          }),
        }
      );

      if (!updateBookingResponse.ok) {
        throw new Error("Không thể cập nhật trạng thái đặt vé");
      }

      // Chuyển đến trang thành công
      navigate("/booking/success", {
        state: {
          booking: bookingData.data,
          showTime,
          selectedSeats,
          promotion,
          totalPrice: bookingData.data.totalPrice,
          payment: paymentData.data,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      setPromoError(error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Tiêu đề */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <MovieIcon sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Xác nhận đặt vé
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Thông tin phim */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <MovieIcon sx={{ mr: 1 }} />
            Thông tin phim
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <img
                  src={
                    movieInfo?.imageUrl || "/images/movies/default-movie.jpg"
                  }
                  alt={movieInfo?.title}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  {movieInfo?.title}
                </Typography>

                {/* Thêm phần hiển thị thể loại */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  {movieInfo?.genres?.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="small"
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#bbdefb",
                        },
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {movieInfo?.description}
                </Typography>
                <Typography variant="body2">
                  Thời lượng: {movieInfo?.duration} phút
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Thông tin suất chiếu */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TheatersIcon sx={{ mr: 1 }} />
            Thông tin suất chiếu
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography>{formatDateTime(showTime?.startTime)}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TheatersIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography>Phòng: {showTime?.room}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Ghế đã chọn */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <EventSeatIcon sx={{ mr: 1 }} />
            Ghế đã chọn
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Grid container spacing={1}>
              {selectedSeats?.map((seat) => (
                <Grid item key={seat.id}>
                  <Chip
                    label={`Ghế ${seat.number}`}
                    color="primary"
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Thông tin thanh toán */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PaymentIcon sx={{ mr: 1 }} />
            Thông tin thanh toán
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
              color: "white",
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Giá vé:</Typography>
                <Typography>{showTime?.price?.toLocaleString()}đ/vé</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Số lượng:</Typography>
                <Typography>{selectedSeats?.length} vé</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Tổng tiền gốc:</Typography>
                <Typography>{totalPrice?.toLocaleString()}đ</Typography>
              </Box>
              {promotion && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Giảm giá ({promotion.discount}%):</Typography>
                  <Typography color="error">
                    -
                    {(totalPrice * (promotion.discount / 100)).toLocaleString()}
                    đ
                  </Typography>
                </Box>
              )}
              <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Thành tiền:</Typography>
                <Typography variant="h6">
                  {calculateFinalPrice().toLocaleString()}đ
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Mã giảm giá */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LocalOfferIcon sx={{ mr: 1 }} />
            Mã giảm giá
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
              />
              <Button variant="contained" onClick={checkPromoCode}>
                Áp dụng
              </Button>
            </Box>
            {promoError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {promoError}
              </Alert>
            )}
            {promotion && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Đã áp dụng mã giảm giá {promotion.discount}%
              </Alert>
            )}
          </Paper>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            sx={{ flex: 1 }}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleBooking}
            sx={{
              flex: 2,
              background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976d2 30%, #1ba9d2 90%)",
              },
            }}
          >
            Xác nhận đặt vé
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;
