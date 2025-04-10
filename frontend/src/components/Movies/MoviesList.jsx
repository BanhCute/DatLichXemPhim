import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import { Link } from "react-router-dom";



const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.data || []))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  

  return (
    <Grid
      container
      spacing={6}
      sx={{
        padding: "24px",
      }}
    >
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} key={movie.id}>
          <Link to={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
          <Card
            sx={{
              height: "100%",
              border: "2px solid #1976d2", // viền xanh đậm (blue primary)
              borderRadius: "16px", // bo góc cho xịn
              boxShadow: 3, // bóng nhẹ tạo chiều sâu
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                boxShadow: 6, // bóng đậm hơn khi hover
                transform: "scale(1.02)", // phóng to nhẹ khi hover
              },
            }}
          >
            <CardMedia
              component="img"
              image={movie.imageUrl}
              alt={movie.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {movie.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: "200px",
                  height: "100%",
                  overflow: "auto",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  paddingRight: "8px",
                }}
              >
                {movie.description}
              </Typography>

              <Button
                size="small"
                color="primary"
                component={Link}
                to={`/booking/${movie.id}`}
              >
                Đặt vé
              </Button>
            </CardContent>
          </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieList;
