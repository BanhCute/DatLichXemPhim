let { PrismaClient } = require("@prisma/client");
const { Update } = require("./authController");

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.payment.findMany({
      include: {
        booking: true,
      },
    });
  },

  Create: async function (body) {
    try {
      let { bookingId, amount, method, status } = body;
      let payment = await prisma.payment.create({
        data: { bookingId, amount, method, status },
      });
      return payment;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Update: async function (req) {
    try {
      let { status } = req.body;
      let payment = await prisma.payment.update({
        where: { id: parseInt(req.params.id) },
        data: { status },
      });
      return payment;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
