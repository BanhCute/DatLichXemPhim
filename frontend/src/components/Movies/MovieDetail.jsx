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
} from "@mui/material";
import ShowTimesList from "../ShowTimes/ShowTimesList";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  console.log("🔑 Token:", token);

  fetch(`http://localhost:5000/api/movies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => res.json())
  .then((data) => {
    console.log("📦 Dữ liệu từ API:", data);
    setMovie(data.data || data);
  })
    .catch((err) => console.error("Error fetching movie:", err));
}, [id]);


  if (!movie) return <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>⏳ Đang tải thông tin phim...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
            <CardMedia
              component="img"
              height="500"
              image={movie.imageUrl || "https://via.placeholder.com/400x500?text=No+Image"}
              alt={movie.title}
              sx={{ borderRadius: 2 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            🎬 {movie.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {movie.description}
          </Typography>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📌 Thông tin phim: 
            </Typography>
            <Typography variant="body2">⏱ Thời lượng: {movie.duration} phút</Typography>
          </Paper>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            📅 Lịch chiếu
          </Typography>
          <ShowTimesList movieId={id} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetail;
