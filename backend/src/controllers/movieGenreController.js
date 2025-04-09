let { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.movieGenre.findMany({
      include: { movie: true, genre: true },
    });
  },

  Create: async function (req) {
    try {
      let { movieId, genreId } = req.body;
      let movieGenre = await prisma.movieGenre.create({
        data: { movieId, genreId },
      });
      return movieGenre;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};