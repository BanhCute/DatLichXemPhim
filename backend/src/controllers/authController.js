const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const authController = {
  CreateAnUser: async function (email, password, name, role = "USER") {
    try {
      let existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("Email đã tồn tại");
      }

      let hashedPassword = await bcrypt.hash(password, 10);
      let user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      });

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Update: async function (req) {
    try {
      let { email, name } = req.body;
      let userId = parseInt(req.params.id);

      let updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          email,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Delete: async function (req) {
    try {
      let userId = parseInt(req.params.id);
      let deletedUser = await prisma.user.delete({
        where: { id: userId },
      });
      return deletedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  CheckLogin: async function (email, password) {
    let user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    return user;
  },

  Me: async function (id) {
    let user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    return user;
  },

  ChangePassword: async function (req, res) {
    try {
      // Lấy user ID từ middleware auth
      const userId = parseInt(req.user.id);
      const { currentPassword, newPassword } = req.body;

      console.log("Attempting password change for user:", userId);

      // Validate input
      if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Thiếu thông tin cần thiết",
        });
      }

      // Tìm user trong database
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
        });
      }

      // Kiểm tra mật khẩu hiện tại
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json({
          message: "Mật khẩu hiện tại không đúng",
        });
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu trong database
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
          updatedAt: new Date(), // Cập nhật thời gian
        },
      });

      console.log("Password updated successfully for user:", userId);

      return res.status(200).json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      console.error("Error in ChangePassword:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server: " + error.message,
      });
    }
  },
};

module.exports = authController;
