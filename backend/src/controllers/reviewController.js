let { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.review.findMany({
      include: { user: true, movie: true },
    });
  },

  Create: async function (req) {
    try {
      let { userId, movieId, rating, comment } = req.body;
      let review = await prisma.review.create({
        data: { userId, movieId, rating, comment },
      });
      return review;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};