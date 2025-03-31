import React, { useState } from "react";
import { Grid, Button, Typography, Box } from "@mui/material";

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seats = [
    ["A1", "A2", "A3", "A4", "A5"],
    ["B1", "B2", "B3", "B4", "B5"],
    ["C1", "C2", "C3", "C4", "C5"],
  ];

  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Chọn ghế
      </Typography>
      <Grid container spacing={1} justifyContent="center">
        {seats.map((row, i) => (
          <Grid container item justifyContent="center" key={i} spacing={1}>
            {row.map((seat) => (
              <Grid item key={seat}>
                <Button
                  variant={
                    selectedSeats.includes(seat) ? "contained" : "outlined"
                  }
                  onClick={() => handleSeatClick(seat)}
                  sx={{ minWidth: "50px" }}
                >
                  {seat}
                </Button>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Typography>Ghế đã chọn: {selectedSeats.join(", ")}</Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedSeats.length === 0}
          sx={{ mt: 2 }}
        >
          Đặt vé
        </Button>
      </Box>
    </Box>
  );
};

export default SeatSelection;
