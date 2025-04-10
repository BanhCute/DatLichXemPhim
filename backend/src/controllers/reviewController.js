let { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.review.findMany({
      include: { user: true, movie: true },
    });
  },

  Create: async function (body) {
    try {
      let { userId, movieId, rating, comment } = body;
      let review = await prisma.review.create({
        data: { userId, movieId, rating, comment },
      });
      return review;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Update: async function (req) {
    try {
      let { rating, comment } = req.body;
      let review = await prisma.review.update({
        where: { id: parseInt(req.params.id) },
        data: { rating, comment },
      });
      return review;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Delete: async function (req) {
    try {
      let reviewId = parseInt(req.params.id);
      let deletedReview = await prisma.review.delete({
        where: { id: reviewId },
      });
      return deletedReview;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};