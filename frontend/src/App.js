import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer"; // 👉 import Footer ở đây
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import MoviesList from "./components/Movies/MoviesList";
import MovieDetail from "./components/Movies/MovieDetail";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import SeatSelection from "./components/Bookings/SeatSelection";
import BookingConfirmation from "./components/Bookings/BookingConfirmation";
import Profile from "./components/User/Profile";
import Home from "./components/Home/Home";
import BookingSuccess from "./components/Bookings/BookingSuccess";
import BookingHistory from "./components/Bookings/BookingHistory";

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
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route
              path="/booking/:showTimeId"
              element={
                <ProtectedRoute>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/confirm"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
