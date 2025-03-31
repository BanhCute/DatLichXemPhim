import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BookingConfirmation = ({ booking }) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Xác nhận đặt vé
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1">Thông tin phim:</Typography>
          <Typography>Phim: {booking?.movie?.title}</Typography>
          <Typography>Suất chiếu: {booking?.showTime?.startTime}</Typography>
          <Typography>Phòng: {booking?.showTime?.room}</Typography>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1">Ghế đã chọn:</Typography>
          <Typography>{booking?.seats?.join(", ")}</Typography>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1">Tổng tiền:</Typography>
          <Typography variant="h6">{booking?.totalPrice}đ</Typography>
        </Box>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button variant="contained" color="primary">
            Xác nhận đặt vé
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;
