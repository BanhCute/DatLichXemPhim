import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Đăng nhập không thành công");
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.data);
        window.location.href = "/movies";

        window.dispatchEvent(new Event("storage"));

      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng nhập
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;