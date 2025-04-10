import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer"; // 👉 import Footer ở đây

import MoviesList from "./components/Movies/MoviesList";
import MovieDetail from "./components/Movies/MovieDetail";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import SeatSelection from "./components/Bookings/SeatSelection";
import BookingConfirmation from "./components/Bookings/BookingConfirmation";
import Profile from "./components/User/Profile";
import Home from "./components/Home/Home";
function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (sau này thêm auth check) */}
            <Route path="/movies" element={<MoviesList />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/booking/:showTimeId" element={<SeatSelection />} />
            <Route path="/booking/confirm" element={<BookingConfirmation />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
