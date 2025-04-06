let { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

module.exports = {
    GetAll: async function () {
        return await prisma.booking.findMany({
            include: {
                user: true,
                showTime: true,
                seats: true,
            },
            where: {
                isDeleted: false,
            },
        });
    },

    GetByUser: async function (req) {
        try {
            if (req.user.id !== parseInt(req.params.userId)) {
                throw new Error("Không có quyền xem lịch sử này");
            }

            let bookings = await prisma.booking.findMany({
                where: { userId: parseInt(req.params.userId) },
                include: {
                    showTime: {
                        include: { movie: true },
                    },
                    seats: true,
                },
            });

            return bookings;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    Create: async function (req) {
        try {
            let { userId, showTimeId, seatNumbers, totalPrice } = req.body;

            let user = await prisma.user.findUnique({ where: { id: userId } });
            let showTime = await prisma.showTime.findUnique({
                where: { id: showTimeId },
            });

            if (!user || !showTime) {
                throw new Error("User hoặc xuất chiếu không tồn tại");
            }

            let booking = await prisma.booking.create({
                data: {
                    userId: userId,
                    showTimeId: showTimeId,
                    totalPrice: totalPrice,
                    status: "PENDING",
                },
            });

            let seats = await Promise.all(
                seatNumbers.map((seatNumber) =>
                    prisma.seat.create({
                        data: {
                            number: seatNumber,
                            status: "BOOKED",
                            showTimeId: showTimeId,
                            bookingId: booking.id,
                        },
                    })
                )
            );

            let bookingWithDetails = await prisma.booking.findUnique({
                where: { id: booking.id },
                include: {
                    user: true,
                    showTime: true,
                    seats: true,
                },
            });

            return bookingWithDetails;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};