import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Đặt vé xem phim
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Trang chủ
          </Button>
          <Button color="inherit" component={Link} to="/movies">
            Phim
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Đăng nhập
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
