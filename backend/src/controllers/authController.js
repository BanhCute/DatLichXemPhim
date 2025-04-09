let { PrismaClient } = require("@prisma/client");
let bcrypt = require("bcrypt");
let prisma = new PrismaClient();
require("dotenv").config();

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

  CheckLogin: async function (email, password) {
    let user = await prisma.user.findUnique({
      where: { email: email },
    });
    console.log(user);
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    return user;
  },
};