const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const router = express.Router();
const prisma = new PrismaClient();

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: "USER",
      },
    });

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "your-secret-key", // Tạm thời hardcode secret key
      { expiresIn: "1h" }
    );

    // Trả về response
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password }); // Debug log

    // Tìm user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log("Found user:", user); // Debug log

    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại" });
    }

    // Kiểm tra password
    if (password !== user.password) {
      return res.status(400).json({ error: "Mật khẩu không đúng" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "your-secret-key", // Tạm thời hardcode secret key
      { expiresIn: "1h" }
    );
    console.log("Generated token:", token); // Debug log

    // Trả về response
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
