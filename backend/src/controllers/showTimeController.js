const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const showTimeController = {
  GetAll: async function () {
    return await prisma.showTime.findMany({
      include: {
        movie: true,
        seats: true,
      },
    });
  },

  GetByMovie: async function (req, res) {
    try {
      const movieId = parseInt(req.params.movieId);

      // Kiểm tra phim tồn tại
      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
      });

      if (!movie) {
        return res.status(404).json({
          message: "Không tìm thấy phim",
        });
      }

      // Lấy TẤT CẢ suất chiếu của phim, không lọc theo thời gian
      const showTimes = await prisma.showTime.findMany({
        where: {
          movieId: movieId,
        },
        orderBy: {
          startTime: "asc", // Sắp xếp theo thời gian tăng dần
        },
      });

      return res.json({
        data: showTimes,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  GetById: async function (req, res) {
    try {
      const showTimeId = parseInt(req.params.id);

      const showTime = await prisma.showTime.findUnique({
        where: { id: showTimeId },
        include: {
          movie: true,
          seats: true,
        },
      });

      if (!showTime) {
        return res.status(404).json({
          message: "Không tìm thấy suất chiếu",
        });
      }

      return res.json({
        data: showTime,
      });
    } catch (error) {
      console.error("Error in GetById:", error);
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  Create: async function (req) {
    try {
      let { movieId, startTime, endTime, room, price } = req.body;
      let showTime = await prisma.showTime.create({
        data: {
          movieId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          room,
          price,
        },
        include: {
          movie: true,
        },
      });
      return showTime;
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
      let showTimes = await prisma.showTime.findMany({
        where: { movieId: parseInt(req.params.id) },
      });

      if (showTimes.length > 0) {
        throw new Error("Không thể xóa phim đang có lịch chiếu");
      }

      let deletedMovie = await prisma.movie.delete({
        where: { id: parseInt(req.params.id) },
      });

      return deletedMovie;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetSeats: async function (req, res) {
    try {
      const showTimeId = parseInt(req.params.id);

      // Kiểm tra suất chiếu tồn tại
      const showTime = await prisma.showTime.findUnique({
        where: { id: showTimeId },
      });

      if (!showTime) {
        return res.status(404).json({
          message: "Không tìm thấy suất chiếu",
        });
      }

      // Lấy danh sách ghế
      const seats = await prisma.seat.findMany({
        where: { showTimeId: showTimeId },
        orderBy: [{ number: "asc" }],
      });

      // Nếu chưa có ghế nào, tạo ghế mặc định
      if (seats.length === 0) {
        const rows = ["A", "B", "C", "D", "E"];
        const seatsPerRow = 8;
        const defaultSeats = [];

        for (let row of rows) {
          for (let i = 1; i <= seatsPerRow; i++) {
            defaultSeats.push({
              number: `${row}${i}`,
              showTimeId: showTimeId,
              status: "AVAILABLE",
            });
          }
        }

        // Tạo ghế trong database
        await prisma.seat.createMany({
          data: defaultSeats,
        });

        // Lấy lại danh sách ghế sau khi tạo
        const newSeats = await prisma.seat.findMany({
          where: { showTimeId: showTimeId },
          orderBy: [{ number: "asc" }],
        });

        return res.json({
          data: newSeats,
        });
      }

      return res.json({
        data: seats,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = showTimeController;
