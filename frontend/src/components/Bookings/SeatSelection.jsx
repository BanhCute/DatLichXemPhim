import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seats = [
    ["A1", "A2", "A3", "A4", "A5"],
    ["B1", "B2", "B3", "B4", "B5"],
    ["C1", "C2", "C3", "C4", "C5"],
    ["D1", "D2", "D3", "D4", "D5"],
    ["E1", "E2", "E3", "E4", "E5"],
    ["F1", "F2", "F3", "F4", "F5"],
  ];

  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        🎟️ Chọn ghế ngồi
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          mt: 2,
        }}
      >
        {seats.map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ display: "flex", gap: 1 }}>
            {row.map((seat) => (
              <Button
                key={seat}
                variant={selectedSeats.includes(seat) ? "contained" : "outlined"}
                color={selectedSeats.includes(seat) ? "success" : "primary"}
                onClick={() => handleSeatClick(seat)}
                sx={{
                  minWidth: 50,
                  minHeight: 50,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: selectedSeats.includes(seat)
                      ? "success.dark"
                      : "primary.light",
                  },
                }}
              >
                {seat}
              </Button>
            ))}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="subtitle1">
          🪑 Ghế đã chọn:{" "}
          <strong>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn ghế nào"}</strong>
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          disabled={selectedSeats.length === 0}
          sx={{ mt: 2, px: 4, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
        >
          ✅ ĐẶT VÉ
        </Button>
      </Box>
    </Box>
  );
};

export default SeatSelection;
