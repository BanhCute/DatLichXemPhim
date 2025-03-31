const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");
const router = express.Router();
const prisma = new PrismaClient();

// GET all showtimes
router.get("/", async (req, res) => {
  try {
    const showTimes = await prisma.showTime.findMany({
      include: {
        movie: true,
        seats: true,
      },
    });
    res.json(showTimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET showtimes by movie
router.get("/movie/:movieId", async (req, res) => {
  try {
    const showTimes = await prisma.showTime.findMany({
      where: { movieId: parseInt(req.params.movieId) },
      include: {
        seats: true,
      },
    });
    res.json(showTimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new showtime
router.post("/", [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { movieId, startTime, endTime, room, price } = req.body;
    const showTime = await prisma.showTime.create({
      data: {
        movieId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        room,
        price,
      },
      include: {
        movie: true,
      },
    });
    res.json(showTime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET showtime by id
router.get("/:id", async (req, res) => {
  try {
    const showTime = await prisma.showTime.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        movie: true,
        seats: true,
        bookings: {
          include: {
            seats: true,
          },
        },
      },
    });

    if (!showTime) {
      return res.status(404).json({ error: "Không tìm thấy suất chiếu" });
    }

    res.json(showTime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
