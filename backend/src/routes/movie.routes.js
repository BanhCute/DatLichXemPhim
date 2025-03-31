const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");
const router = express.Router();
const prisma = new PrismaClient();

// Route public - Ai cũng xem được
router.get("/", async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        showTimes: true,
      },
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route cần đăng nhập - Chỉ user đã đăng nhập mới xem được
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        showTimes: {
          include: {
            seats: true,
          },
        },
      },
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route admin - Chỉ admin mới thêm được phim
router.post("/", [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { title, description, duration, imageUrl } = req.body;
    const movie = await prisma.movie.create({
      data: { title, description, duration, imageUrl },
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update movie (admin only)
router.put("/:id", [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { title, description, duration, imageUrl } = req.body;
    const movie = await prisma.movie.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        duration,
        imageUrl,
      },
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE movie (admin only)
router.delete("/:id", [authenticateToken, isAdmin], async (req, res) => {
  try {
    // Kiểm tra có showtime nào đang sử dụng phim không
    const showTimes = await prisma.showTime.findMany({
      where: { movieId: parseInt(req.params.id) },
    });

    if (showTimes.length > 0) {
      return res.status(400).json({
        error: "Không thể xóa phim đang có lịch chiếu",
      });
    }

    await prisma.movie.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Đã xóa phim thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
