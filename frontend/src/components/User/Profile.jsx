import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

const Profile = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch user bookings
    const userId = 1; // Sẽ lấy từ context/redux sau
    fetch(`http://localhost:5000/api/bookings/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Thông tin cá nhân
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1">Email: user@example.com</Typography>
          <Typography variant="subtitle1">Họ tên: User Name</Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>
            Cập nhật thông tin
          </Button>
        </Box>
        <Typography variant="h6" gutterBottom>
          Lịch sử đặt vé
        </Typography>
        <List>
          {bookings.map((booking) => (
            <React.Fragment key={booking.id}>
              <ListItem>
                <ListItemText
                  primary={booking.showTime.movie.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Suất chiếu:{" "}
                        {new Date(booking.showTime.startTime).toLocaleString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Ghế:{" "}
                        {booking.seats.map((seat) => seat.number).join(", ")}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Profile;
