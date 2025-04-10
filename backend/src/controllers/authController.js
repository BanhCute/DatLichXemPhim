let { PrismaClient } = require("@prisma/client");
let bcrypt = require("bcrypt");
let prisma = new PrismaClient();

module.exports = {
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
      let { email, name, role } = req.body;
      let userId = parseInt(req.params.id);

      let updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email,
          name,
          role,
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
      select: { id: true, email: true, name: true , role: true },
    });
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    return user;
  },
};