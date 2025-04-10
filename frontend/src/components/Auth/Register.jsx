import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Thông tin đăng ký:", formData);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/images/anhNen/anhNenAuth.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          borderRadius: 4,
          color: "#fff",
          width: "100%",
          maxWidth: 440,
        }}
      >
        <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    mb: 2,
  }}
>
  <Typography
    component="h1"
    variant="h4"
    align="center"
    gutterBottom
    sx={{ fontWeight: "bold", letterSpacing: 1, color: "#fff" }}
  >
    🎬 RẠP PHIM LGTV
  </Typography>
</Box>


        <Typography variant="h6" align="center" sx={{ mb: 2, color: "#ccc" }}>
          Đăng ký tài khoản của bạn
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Họ tên"
            name="name"
            variant="filled"
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            variant="filled"
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Mật khẩu"
            name="password"
            type="password"
            variant="filled"
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type="password"
            variant="filled"
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#e50914",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#b81d24",
              },
            }}
          >
            Đăng ký
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
