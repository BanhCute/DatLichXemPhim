const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const bookingController = {
  GetAll: async function (req, res) {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          showTime: {
            include: {
              movie: true,
            },
          },
          seats: true,
        },
      });
      return res.json({ data: bookings });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  GetById: async function (req, res) {
    try {
      const bookingId = parseInt(req.params.id);

      if (!bookingId) {
        return res.status(400).json({
          message: "ID đặt vé không hợp lệ",
        });
      }

      const booking = await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
        include: {
          showTime: {
            include: {
              movie: true,
            },
          },
          seats: true,
          promotion: true,
        },
      });

      if (!booking) {
        return res.status(404).json({
          message: "Không tìm thấy đơn đặt vé",
        });
      }

      return res.json({
        data: booking,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi server: " + error.message,
      });
    }
  },

  Create: async function (req, res) {
    try {
      let { showTimeId, seatNumbers, promotionCode } = req.body;

      const token = req.headers.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      let user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const showTimeIdInt = parseInt(showTimeId);
      let showTime = await prisma.showTime.findUnique({
        where: { id: showTimeIdInt },
        include: {
          movie: true,
        },
      });

      if (!user || !showTime) {
        return res
          .status(404)
          .json({ message: "User hoặc suất chiếu không tồn tại" });
      }

      let totalPrice = seatNumbers.length * showTime.price;
      let promotionId = null;

      if (promotionCode) {
        const promotion = await prisma.promotion.findFirst({
          where: {
            code: promotionCode,
            startDate: {
              lte: new Date(),
            },
            endDate: {
              gte: new Date(),
            },
          },
        });

        if (promotion) {
          promotionId = promotion.id;
          const discount = totalPrice * (promotion.discount / 100);
          totalPrice = totalPrice - discount;
        }
      }

      const booking = await prisma.booking.create({
        data: {
          userId,
          showTimeId: showTimeIdInt,
          totalPrice,
          status: "PENDING",
          promotionId: promotionId,
        },
        include: {
          promotion: true,
          seats: true,
          showTime: {
            include: {
              movie: true,
            },
          },
        },
      });

      await prisma.seat.updateMany({
        where: {
          showTimeId: showTimeIdInt,
          number: { in: seatNumbers },
        },
        data: {
          status: "BOOKED",
          bookingId: booking.id,
        },
      });

      return res.json({
        data: booking,
        message: "Đặt vé thành công",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  GetMyBookings: async function (req, res) {
    try {
      const userId = parseInt(req.user.id);
      const bookings = await prisma.booking.findMany({
        where: {
          userId: userId,
        },
        include: {
          showTime: {
            include: {
              movie: true,
            },
          },
          seats: true,
          promotion: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.json({
        data: bookings,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi server: " + error.message,
      });
    }
  },
};

module.exports = bookingController;