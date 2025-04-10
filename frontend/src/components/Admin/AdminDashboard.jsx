import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import CategoryIcon from "@mui/icons-material/Category";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0); // Set giá trị tab hiện tại

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

  const menuItems = [
    {
      title: "Quản lý Phim",
      icon: <MovieIcon sx={{ fontSize: 60, color: "#e50914" }} />,
      description: "Thêm, sửa, xóa phim và quản lý thông tin phim",
      link: "/admin/movies",
      color: "#141414",
    },
    {
      title: "Quản lý Thể Loại",
      icon: <CategoryIcon sx={{ fontSize: 60, color: "#e50914" }} />,
      description: "Quản lý các thể loại phim",
      link: "/admin/genres",
      color: "#141414",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Admin Navigation */}
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

      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#e50914",
          textAlign: "center",
        }}
      >
        Trang Quản Trị
      </Typography>

      <Grid container spacing={4}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: item.color,
                color: "white",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 4,
                }}
              >
                {item.icon}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mt: 2, fontWeight: "bold" }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 2, mb: 3, color: "#ccc" }}
                >
                  {item.description}
                </Typography>
                <Button
                  component={Link}
                  to={item.link}
                  variant="contained"
                  sx={{
                    mt: "auto",
                    backgroundColor: "#e50914",
                    "&:hover": {
                      backgroundColor: "#b81d24",
                    },
                  }}
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
