let { PrismaClient } = require("@prisma/client");
const { Update } = require("./authController");

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.promotion.findMany();
  },

  Create: async function (body) {
    try {
      let { code, discount, startDate, endDate } = body;
      let promotion = await prisma.promotion.create({
        data: { code, discount, startDate, endDate },
      });
      return promotion;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Update: async function (req) {
    try {
      let { code, discount, startDate, endDate } = req.body;
      let promotion = await prisma.promotion.update({
        where: { id: parseInt(req.params.id) },
        data: { code, discount, startDate, endDate },
      });
      return promotion;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Delete: async function (req) {
    try {
      let promotionId = parseInt(req.params.id);
      let deletedPromotion = await prisma.promotion.delete({
        where: { id: promotionId },
      });
      return deletedPromotion;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};