import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Container,
  Box,
  Rating,
  Chip,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.data || []))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#1976d2",
            mb: 4,
          }}
        >
          <LocalMoviesIcon sx={{ fontSize: 40, mr: 2 }} />
          Phim Đang Chiếu
        </Typography>

        <Grid container spacing={4}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={
                      movie.imageUrl && movie.imageUrl !== "NULL"
                        ? movie.imageUrl
                        : "/images/movies/default-movie.jpg"
                    }
                    alt={movie.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/movies/default-movie.jpg";
                    }}
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      p: 1,
                    }}
                  >
                    <IconButton
                      sx={{
                        bgcolor: "rgba(255,255,255,0.9)",
                        "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                      }}
                    >
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: "rgba(0,0,0,0.7)",
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "white" }}>
                      {movie.title}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Rating value={4} readOnly size="small" />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {movie.description}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body2" color="primary">
                      {movie.duration} phút
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    <Chip label="Hành động" size="small" color="primary" />
                    <Chip label="Phiêu lưu" size="small" color="secondary" />
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/booking/${movie.id}`}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Đặt vé ngay
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default MovieList;
