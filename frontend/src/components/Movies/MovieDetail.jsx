import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ShowTimesList from "../ShowTimes/ShowTimesList";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Error fetching movie:", err));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={movie.imageUrl}
              alt={movie.title}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {movie.description}
          </Typography>
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">Thông tin phim:</Typography>
            <Typography>Thời lượng: {movie.duration} phút</Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Lịch chiếu:
          </Typography>
          <ShowTimesList movieId={id} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetail;
