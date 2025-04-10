import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  CircularProgress,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import dayjs from "dayjs";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token); // Debug log

      if (!token) {
        throw new Error("Vui lòng đăng nhập");
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Không thể tải lịch sử đặt vé");
      }

      if (!data.data) {
        throw new Error("Dữ liệu không hợp lệ");
      }

      setBookings(data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error in fetchBookings:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(to right, #1a237e, #0d47a1)",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Bạn chưa có đơn đặt vé nào</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#1a237e", mb: 4 }}>
        Lịch sử đặt vé
      </Typography>

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking.id}>
            <Card
              sx={{
                display: "flex",
                background: "linear-gradient(to right, #1a237e, #0d47a1)",
                color: "white",
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: 200 }}
                image={
                  booking.showTime?.movie?.imageUrl || "/default-movie.jpg"
                }
                alt={booking.showTime?.movie?.title}
              />
              <Box
                sx={{ display: "flex", flexDirection: "column", flex: 1, p: 2 }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5">
                      {booking.showTime?.movie?.title}
                    </Typography>
                    <Chip
                      label={
                        booking.status === "PENDING"
                          ? "Chờ xác nhận"
                          : booking.status === "CONFIRMED"
                          ? "Đã xác nhận"
                          : "Đã hủy"
                      }
                      color={
                        booking.status === "PENDING"
                          ? "warning"
                          : booking.status === "CONFIRMED"
                          ? "success"
                          : "error"
                      }
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <AccessTimeIcon sx={{ mr: 1 }} />
                        <Typography>
                          {dayjs(booking.showTime?.startTime).format(
                            "HH:mm - DD/MM/YYYY"
                          )}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <EventSeatIcon sx={{ mr: 1 }} />
                        <Typography>
                          Ghế:{" "}
                          {booking.seats?.map((seat) => seat.number).join(", ")}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <MovieIcon sx={{ mr: 1 }} />
                        <Typography>Phòng: {booking.showTime?.room}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PaymentIcon sx={{ mr: 1 }} />
                        <Typography>
                          Tổng tiền: {booking.totalPrice?.toLocaleString()}đ
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {booking.promotion && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`Mã giảm giá: ${booking.promotion.code} (-${booking.promotion.discount}%)`}
                        color="success"
                        variant="outlined"
                        sx={{
                          borderColor: "rgba(255,255,255,0.5)",
                          color: "white",
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookingHistory;
