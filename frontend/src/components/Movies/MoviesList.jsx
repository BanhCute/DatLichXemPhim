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
  IconButton,
  Skeleton,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Fade,
} from "@mui/material";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        console.log("Movies data:", data);
        setMovies(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setError("Không thể tải danh sách phim");
        setLoading(false);
      });
  }, []);

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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#1976d2" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
            px: 2,
            py: 3,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
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
              mb: { xs: 3, md: 0 },
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <LocalMoviesIcon sx={{ fontSize: 50, mr: 2, color: "#ff4081" }} />
            Phim Đang Chiếu
          </Typography>

          <TextField
            placeholder="Tìm kiếm phim..."
            variant="outlined"
            size="medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", md: "350px" },
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#1976d2",
                },
                "&:hover fieldset": {
                  borderColor: "#ff4081",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff4081",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#1976d2" }} />
                </InputAdornment>
              ),
              sx: {
                fontFamily: "'Roboto', sans-serif",
                color: "#333",
              },
            }}
          />
        </Box>

        {/* Error Message */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          TransitionComponent={Fade}
        >
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              fontWeight: "medium",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Movies Grid */}
        <Grid container spacing={4}>
          {filteredMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card
                component={Link}
                to={`/movies/${movie.id}`}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
                  },
                  backgroundColor: "#fff",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="450"
                    image={movie.imageUrl || "/images/default-movie.jpg"}
                    alt={movie.title}
                    sx={{
                      objectFit: "cover",
                      transition: "opacity 0.3s ease",
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(movie.id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    }}
                  >
                    {favorites.includes(movie.id) ? (
                      <FavoriteIcon sx={{ color: "#ff4081" }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: "#ff4081" }} />
                    )}
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    noWrap
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {movie.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      mb: 2,
                    }}
                  >
                    {movie.genres?.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        size="small"
                        sx={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: "medium",
                          "&:hover": {
                            backgroundColor: "#bbdefb",
                          },
                        }}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      fontFamily: "'Roboto', sans-serif",
                      color: "#666",
                      mb: 2,
                    }}
                  >
                    {movie.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#888",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ fontSize: 18, mr: 1, color: "#1976d2" }}
                    />
                    {movie.duration} phút
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/movies/${movie.id}`}
                    sx={{
                      width: "100%",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#ff4081",
                        transform: "scale(1.05)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* No Results Message */}
        {filteredMovies.length === 0 && !loading && (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: 3,
              mt: 4,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "#ff4081" }} />
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ fontFamily: "'Poppins', sans-serif", color: "#666" }}
            >
              Không tìm thấy phim phù hợp
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSearchTerm("")}
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#ff4081",
                  color: "#ff4081",
                },
              }}
            >
              Xóa tìm kiếm
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MoviesList;
