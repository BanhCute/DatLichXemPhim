import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Không tìm thấy thông tin đặt vé
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          background: "linear-gradient(to right, #4CAF50, #45a049)",
          color: "white",
          borderRadius: 2,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Đặt vé thành công!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Mã đặt vé: #{booking.id}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chi tiết đặt vé
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Tổng tiền
          </Typography>
          <Typography variant="h6">
            {booking.totalPrice.toLocaleString()}đ
            {booking.promotion && (
              <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                (Đã giảm {booking.promotion.discount}%)
              </Typography>
            )}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Thời gian đặt
          </Typography>
          <Typography>
            {dayjs(booking.createdAt).format("HH:mm - DD/MM/YYYY")}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Phương thức thanh toán
          </Typography>
          <Typography>
            {location.state.payment?.method === "CASH" ? "Tiền mặt" : "Thẻ"}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Trạng thái thanh toán
          </Typography>
          <Chip
            label={
              location.state.payment?.status === "COMPLETED"
                ? "Đã thanh toán"
                : "Chờ thanh toán"
            }
            color={
              location.state.payment?.status === "COMPLETED"
                ? "success"
                : "warning"
            }
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {booking.showTime?.movie?.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/bookings")}
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            }}
          >
            Xem lịch sử đặt vé
          </Button>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingSuccess;
