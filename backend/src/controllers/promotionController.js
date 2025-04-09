let { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.promotion.findMany();
  },

  Create: async function (req) {
    try {
      let { code, discount, startDate, endDate } = req.body;
      let promotion = await prisma.promotion.create({
        data: { code, discount, startDate, endDate },
      });
      return promotion;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};