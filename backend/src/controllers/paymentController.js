let { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.payment.findMany({
      include: {
        booking: true,
      },
    });
  },

  Create: async function (req) {
    try {
      let { bookingId, amount, method, status } = req.body;
      let payment = await prisma.payment.create({
        data: { bookingId, amount, method, status },
      });
      return payment;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};