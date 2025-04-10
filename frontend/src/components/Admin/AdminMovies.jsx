import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMovies(data.data);
    } catch (err) {
      setError("Không thể tải danh sách phim");
    }
  };

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/genres", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGenres(data.data);
    } catch (err) {
      setError("Không thể tải danh sách thể loại");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const movieData = {
        ...formData,
        genreIds: selectedGenres,
      };

      const url = editMovie
        ? `http://localhost:5000/api/movies/${editMovie.id}`
        : "http://localhost:5000/api/movies";

      const method = editMovie ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) throw new Error("Thao tác không thành công");

      setOpen(false);
      fetchMovies();
      setFormData({
        title: "",
        description: "",
        duration: "",
        imageUrl: "",
      });
      setSelectedGenres([]);
      setEditMovie(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phim này?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Không thể xóa phim");

      fetchMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate("/admin");
        break;
      case 1:
        navigate("/admin/movies");
        break;
      case 2:
        navigate("/admin/genres");
        break;
    }
  };

  const handleGenreChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedGenres(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    if (editMovie) {
      setSelectedGenres(editMovie.genres?.map((genre) => genre.id) || []);
    }
  }, [editMovie]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              color: "#666",
              "&.Mui-selected": {
                color: "#e50914",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#e50914",
            },
          }}
        >
          <Tab label="DASHBOARD" />
          <Tab label="QUẢN LÝ PHIM" />
          <Tab label="QUẢN LÝ THỂ LOẠI" />
        </Tabs>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Quản Lý Phim</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditMovie(null);
            setFormData({
              title: "",
              description: "",
              duration: "",
              imageUrl: "",
            });
            setSelectedGenres([]);
            setOpen(true);
          }}
        >
          Thêm Phim Mới
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Phim</TableCell>
              <TableCell>Thời Lượng</TableCell>
              <TableCell>Thể Loại</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.duration} phút</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {movie.genres?.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        size="small"
                        sx={{
                          backgroundColor: "#1e3a8a",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#1e4899",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setEditMovie(movie);
                      setFormData(movie);
                      setSelectedGenres(movie.genres?.map((g) => g.id) || []);
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(movie.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMovie ? "Chỉnh Sửa Phim" : "Thêm Phim Mới"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên phim"
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Thời lượng (phút)"
            fullWidth
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="URL Hình ảnh"
            fullWidth
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="genres-label">Thể loại</InputLabel>
            <Select
              labelId="genres-label"
              multiple
              value={selectedGenres}
              onChange={handleGenreChange}
              input={<OutlinedInput label="Thể loại" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((genreId) => {
                    const genre = genres.find((g) => g.id === genreId);
                    return (
                      <Chip
                        key={genreId}
                        label={genre?.name}
                        sx={{
                          backgroundColor: "#1e3a8a",
                          color: "white",
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMovie ? "Cập Nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMovies;
