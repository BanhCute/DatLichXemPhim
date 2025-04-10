import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);

    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#141414",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#e50914",
            letterSpacing: 1.5,
          }}
        >
          🎬 RẠP PHIM LGTV
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/"
            sx={{
              color: "#fff",
              mx: 1,
              "&:hover": { color: "#e50914" },
            }}
          >
            Trang chủ
          </Button>
          <Button
            component={Link}
            to="/movies"
            sx={{
              color: "#fff",
              mx: 1,
              "&:hover": { color: "#e50914" },
            }}
          >
            Phim
          </Button>

          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              sx={{
                color: "#fff",
                mx: 1,
                "&:hover": { color: "#e50914" },
              }}
            >
              Đăng xuất
            </Button>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                color: "#fff",
                mx: 1,
                "&:hover": { color: "#e50914" },
              }}
            >
              Đăng nhập
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
