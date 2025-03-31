const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const { authenticateToken } = require("../middleware/auth.middleware");

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        showTime: true,
        seats: true,
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET lịch sử đặt vé của user
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.userId)) {
      return res.status(403).json({ error: "Không có quyền xem lịch sử này" });
    }
    const bookings = await prisma.booking.findMany({
      where: { userId: parseInt(req.params.userId) },
      include: {
        showTime: {
          include: { movie: true },
        },
        seats: true,
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { userId, showTimeId, seatNumbers, totalPrice } = req.body;

    // Kiểm tra user và showtime có tồn tại không
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const showTime = await prisma.showTime.findUnique({
      where: { id: showTimeId },
    });

    if (!user || !showTime) {
      return res
        .status(404)
        .json({ error: "User hoặc ShowTime không tồn tại" });
    }

    // Tạo booking
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        showTimeId: showTimeId,
        totalPrice: totalPrice,
        status: "PENDING",
      },
    });

    // Tạo seats cho booking
    const seats = await Promise.all(
      seatNumbers.map((seatNumber) =>
        prisma.seat.create({
          data: {
            number: seatNumber,
            status: "BOOKED",
            showTimeId: showTimeId,
            bookingId: booking.id,
          },
        })
      )
    );

    // Trả về kết quả với đầy đủ thông tin
    const bookingWithDetails = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        user: true,
        showTime: true,
        seats: true,
      },
    });

    res.json(bookingWithDetails);
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
