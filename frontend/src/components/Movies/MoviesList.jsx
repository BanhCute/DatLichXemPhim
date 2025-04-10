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
  Skeleton,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/movies");
      const data = await res.json();
      setMovies(data.data || []);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải danh sách phim. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const toggleFavorite = (movieId) => {
    setFavorites((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
              mb: { xs: 2, md: 0 },
            }}
          >
            <LocalMoviesIcon sx={{ fontSize: 40, mr: 2 }} />
            Phim Đang Chiếu
          </Typography>

          <TextField
            placeholder="Tìm kiếm phim..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", md: "300px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Error Message */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>

        {/* Movies Grid */}
        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{ height: "100%" }}>
                    <Skeleton variant="rectangular" height={400} />
                    <Box sx={{ p: 2 }}>
                      <Skeleton variant="text" height={32} />
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="text" height={20} />
                    </Box>
                  </Card>
                </Grid>
              ))
            : filteredMovies.map((movie) => (
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
                          movie.imageUrl || "/images/movies/default-movie.jpg"
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

                      {/* Favorite Button */}
                      <IconButton
                        onClick={() => toggleFavorite(movie.id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(255,255,255,0.9)",
                          "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                        }}
                      >
                        <FavoriteIcon
                          color={
                            favorites.includes(movie.id) ? "error" : "action"
                          }
                        />
                      </IconButton>

                      {/* Movie Info Overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: "rgba(0,0,0,0.7)",
                          p: 2,
                          transition: "all 0.3s",
                        }}
                      >
                        <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                          {movie.title}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccessTimeIcon sx={{ color: "white", mr: 0.5 }} />
                            <Typography variant="body2" sx={{ color: "white" }}>
                              {movie.duration} phút
                            </Typography>
                          </Box>
                          {movie.showTimes?.length > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CalendarMonthIcon
                                sx={{ color: "white", mr: 0.5 }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: "white" }}
                              >
                                {movie.showTimes.length} suất chiếu
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          height: "4.5em",
                        }}
                      >
                        {movie.description}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>
                        <Button
                          variant="contained"
                          fullWidth
                          component={Link}
                          to={`/movies/${movie.id}`}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: "bold",
                            mt: 2,
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {/* No Results Message */}
        {!loading && filteredMovies.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 60, color: "text.secondary" }} />
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy phim phù hợp
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MoviesList;
