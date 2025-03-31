const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
require("dotenv").config();

// Controller xử lý logic đăng ký
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email,
        password, // Tạm thời lưu password trực tiếp, sau này sẽ hash
        name,
        role: "USER",
      },
    });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Trả về token và thông tin user
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
};

// Controller xử lý logic đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user tồn tại
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("Found user:", user); // Log để debug

    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại" });
    }

    if (password !== user.password) {
      return res.status(400).json({ error: "Mật khẩu không đúng" });
    }

    // Tạo token với đầy đủ thông tin
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Trả về đầy đủ thông tin
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
};
