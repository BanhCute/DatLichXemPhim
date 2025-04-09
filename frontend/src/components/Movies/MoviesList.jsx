import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.data || []))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <Stack
      sx={{
        width: "100vw",
        height: "100vh",
        padding: "24px",
        
      }}
    >
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card sx={{height: "100%"}}>
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

                <Button size="small" color="primary">
                  Đặt vé
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default MovieList;
