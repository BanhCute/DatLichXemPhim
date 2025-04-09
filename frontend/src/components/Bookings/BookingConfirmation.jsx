import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movie } = location.state || {}; // Lấy thông tin phim từ state

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Xác nhận đặt vé
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1">Thông tin phim:</Typography>
          <Typography>Phim: {movie?.title}</Typography>
          <Typography>Mô tả: {movie?.description}</Typography>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1">Ghế đã chọn:</Typography>
          <Typography>Vui lòng chọn ghế ở bước tiếp theo.</Typography>
        </Box>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/seat-selection", { state: { movie } })}
          >
            Chọn ghế
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;
