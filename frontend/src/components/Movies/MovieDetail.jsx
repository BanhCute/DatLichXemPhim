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
} from "@mui/material";
import ShowTimesList from "../ShowTimes/ShowTimesList";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token:", token);

    // Nếu backend lỡ trả thẳng data = movie thay vì data: { movie }
    fetch(`http://localhost:5000/api/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("👉 data trả về:", data);
        if (data.data) {
          setMovie(data.data);
        } else {
          setMovie(data); // fallback nếu API thay đổi
        }
      })

      .catch((err) => console.error("❌ Error fetching movie:", err));
  }, [id]);

  if (!movie || !movie.title) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
        ⏳ Đang tải thông tin phim...
      </Typography>
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
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight="bold">
                🎬 {movie.title}
              </Typography>

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

        <ShowTimesList movieId={id} />
      </Box>
    </Container>
  );
};

export default MovieDetail;
