const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const movieController = {
  GetAll: async function (req, res) {
    try {
      const movies = await prisma.movie.findMany({
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      });
      const transformedMovies = movies.map((movie) => ({
        ...movie,
        genres: movie.genres.map((mg) => mg.genre),
      }));
      return res.json({ data: transformedMovies });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  GetById: async function (req, res) {
    try {
      const id = parseInt(req.params.id);
      const movie = await prisma.movie.findUnique({
        where: { id },
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
          showTimes: {
            where: {
              startTime: {
                gte: new Date(), // Chỉ lấy lịch chiếu từ hiện tại trở đi
              },
            },
            orderBy: {
              startTime: "asc",
            },
          },
        },
      });

      if (!movie) {
        return res.status(404).json({
          message: "Không tìm thấy phim",
        });
      }

      const transformedMovie = {
        ...movie,
        genres: movie.genres.map((mg) => mg.genre),
      };

      return res.json({ data: transformedMovie });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  Create: async function (req) {
    try {
      let { title, description, duration, imageUrl } = req.body;
      let movie = await prisma.movie.create({
        data: { title, description, duration, imageUrl },
      });
      return movie;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Update: async function (req) {
    try {
      let { title, description, duration, imageUrl } = req.body;

      let movie = await prisma.movie.update({
        where: { id: parseInt(req.params.id) },
        data: {
          title,
          description,
          duration,
          imageUrl,
        },
      });

      return movie;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Delete: async function (req) {
    try {
      const movieId = parseInt(req.params.id);
      const movieGenres = await prisma.movieGenre.findMany({
        where: { movieId: movieId },
      });
      if (movieGenres.length > 0) {
        throw new Error("Không thể xóa phim vì đang liên kết với thể loại");
      }
      let showTimes = await prisma.showTime.findMany({
        where: { movieId: movieId },
      });
      if (showTimes.length > 0) {
        const bookings = await prisma.booking.findMany({
          where: {
            showTimeId: { in: showTimes.map((st) => st.id) },
          },
        });
        if (bookings.length > 0) {
          throw new Error("Không thể xóa phim vì đã có người đặt vé");
        }
        throw new Error("Không thể xóa phim vì phim đang có lịch chiếu");
      }
      let deletedMovie = await prisma.movie.delete({
        where: { id: movieId },
      });
      return deletedMovie;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = movieController;