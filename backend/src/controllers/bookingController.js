const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const bookingController = {
  // Get all bookings
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

  // Get booking by id
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
      console.error("Error in GetById:", error);
      return res.status(500).json({
        message: "Lỗi server: " + error.message,
      });
    }
  },

  // Create booking
  Create: async function (req, res) {
    try {
      let { showTimeId, seatNumbers, promotionCode } = req.body;

      // Lấy userId từ token
      const token = req.headers.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Kiểm tra user và showTime
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

      // Tính tổng tiền gốc
      let totalPrice = seatNumbers.length * showTime.price;
      let promotionId = null;

      // Kiểm tra và áp dụng mã giảm giá nếu có
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

      // Tạo booking với promotionId
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

      // Cập nhật trạng thái ghế
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
      console.error("Booking error:", error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Update booking
  Update: async function (req, res) {
    try {
      const booking = await prisma.booking.update({
        where: { id: parseInt(req.params.id) },
        data: req.body,
      });
      return res.json({ data: booking });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Delete booking
  Delete: async function (req, res) {
    try {
      await prisma.booking.delete({
        where: { id: parseInt(req.params.id) },
      });
      return res.json({ message: "Xóa đơn đặt vé thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  GetMyBookings: async function (req, res) {
    try {
      // Lấy userId từ token đã được decode trong middleware
      const userId = parseInt(req.user.id);
      console.log("Getting bookings for userId:", userId);

      // Lấy danh sách booking
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

      console.log("Found bookings:", bookings);

      return res.json({
        data: bookings,
      });
    } catch (error) {
      console.error("Error in GetMyBookings:", error);
      return res.status(500).json({
        message: "Lỗi server: " + error.message,
      });
    }
  },
};

module.exports = bookingController;
