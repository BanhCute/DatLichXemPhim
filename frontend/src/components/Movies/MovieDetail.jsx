import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Divider,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import ShowTimesList from "../ShowTimes/ShowTimesList";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); // Bắt đầu loading
    fetch(`http://localhost:5000/api/movies/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể tải thông tin phim");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Movie data:", data);
        // Kiểm tra cấu trúc data và set đúng dữ liệu
        if (data && (data.data || data)) {
          setMovie(data.data || data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          ⏳ Đang tải thông tin phim...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6" color="error">
          ❌ {error}
        </Typography>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6">😢 Không tìm thấy thông tin phim</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4}>
          {/* Ảnh bên trái */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardMedia
                component="img"
                height="500"
                image={
                  movie.imageUrl ||
                  "https://via.placeholder.com/400x500?text=No+Image"
                }
                alt={movie.title}
                sx={{ borderRadius: 2 }}
              />
            </Card>
          </Grid>

          {/* Thông tin bên phải */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Typography variant="h4" component="h1">
                {movie.title}
              </Typography>

              {/* Thêm phần hiển thị thể loại */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {movie.genres?.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    sx={{
                      backgroundColor: "#1e3a8a",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1e4899",
                      },
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>

              <Box>
                <Typography variant="h6" color="text.secondary">
                  📌 Thông tin phim:
                </Typography>

                <Typography variant="body1" sx={{ mt: 1 }}>
                  {movie.description}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  ⏱ Thời lượng: {movie.duration} phút
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Lịch chiếu */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📅 Lịch chiếu
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <ShowTimesList movieId={id} requireAuth={true} />
      </Box>
    </Container>
  );
};

export default MovieDetail;
