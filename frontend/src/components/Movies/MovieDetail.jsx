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
  Rating,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import ShowTimesList from "../ShowTimes/ShowTimesList";
import StarIcon from "@mui/icons-material/Star";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // Lọc reviews cho phim hiện tại
      const movieReviews = data.data.filter(
        (review) => review.movieId === parseInt(id)
      );
      console.log("Movie reviews:", movieReviews); // Để debug
      setReviews(movieReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để đánh giá");
      }

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: parseInt(id),
          rating: userReview.rating,
          comment: userReview.comment || "", // Đảm bảo comment không null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể gửi đánh giá");
      }

      // Reset form và load lại reviews
      setUserReview({ rating: 0, comment: "" });
      fetchReviews();

      // Thông báo thành công
      alert("Đánh giá thành công!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Thêm phần Reviews sau phần Lịch chiếu */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ⭐ Đánh giá phim
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Form đánh giá */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmitReview}>
            <Box sx={{ mb: 2 }}>
              <Typography component="legend">Đánh giá của bạn</Typography>
              <Rating
                name="rating"
                value={userReview.rating}
                onChange={(event, newValue) => {
                  setUserReview({ ...userReview, rating: newValue });
                }}
                precision={1}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Nhập nhận xét của bạn..."
              value={userReview.comment}
              onChange={(e) =>
                setUserReview({ ...userReview, comment: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || userReview.rating === 0}
              sx={{
                backgroundColor: "#e50914",
                "&:hover": { backgroundColor: "#b81d24" },
              }}
            >
              Gửi đánh giá
            </Button>
          </form>
        </Paper>

        {/* Danh sách đánh giá */}
        <Box>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar sx={{ mr: 2, bgcolor: "#e50914" }}>
                    {review.user?.name?.[0] || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.user?.name || "Người dùng ẩn danh"}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="caption" sx={{ ml: "auto" }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{review.comment}</Typography>
              </Paper>
            ))
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Chưa có đánh giá nào cho phim này
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default MovieDetail;
