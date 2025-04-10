let { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    GetAll: async function () {
        return await prisma.booking.findMany({
            include: {
                user: true,
                showTime: true,
                seats: true,
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
            let { userId, showTimeId, seatNumbers, promotionId } = req.body;
    
            // Kiểm tra user và showTime
            let user = await prisma.user.findUnique({ where: { id: userId } });
            let showTime = await prisma.showTime.findUnique({
                where: { id: showTimeId },
            });
    
            if (!user || !showTime) {
                throw new Error("User hoặc xuất chiếu không tồn tại");
            }
    
            // Kiểm tra seats đã được book chưa
            const existingSeats = await prisma.seat.findMany({
                where: {
                    showTimeId: showTimeId,
                    number: { in: seatNumbers },
                    status: "BOOKED"
                }
            });
    
            if (existingSeats.length > 0) {
                const bookedSeatNumbers = existingSeats.map(seat => seat.number);
                throw new Error(`Các ghế ${bookedSeatNumbers.join(", ")} đã được đặt`);
            }
    
            // Lấy thông tin promotion nếu có
            let promotion = null;
            if (promotionId) {
                promotion = await prisma.promotion.findUnique({
                    where: { id: promotionId },
                });
                if (!promotion) {
                    throw new Error("Mã khuyến mãi không tồn tại");
                }
                const currentDate = new Date();
                if (currentDate < new Date(promotion.startDate) || 
                    currentDate > new Date(promotion.endDate)) {
                    throw new Error("Mã khuyến mãi đã hết hạn");
                }
            }
    
            // Tính tổng giá
            const basePrice = showTime.price;
            const quantity = seatNumbers.length;
            let totalPrice = basePrice * quantity;
    
            // Áp dụng promotion nếu có
            if (promotion) {
                let discount = totalPrice * (promotion.discount / 100);
                totalPrice -= discount;
            }
    
            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            const bookingResult = await prisma.$transaction(async (prisma) => {
                // Tạo booking
                const booking = await prisma.booking.create({
                    data: {
                        userId: userId,
                        showTimeId: showTimeId,
                        totalPrice: totalPrice,
                        status: "PENDING",
                        promotionId: promotionId || null,
                    },
                });
    
                // Tạo seats
                const seats = await Promise.all(
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
    
                return { booking, seats };
            });
    
            // Lấy thông tin chi tiết booking
            let bookingWithDetails = await prisma.booking.findUnique({
                where: { id: bookingResult.booking.id },
                include: {
                    user: true,
                    showTime: true,
                    seats: true,
                    promotion: true,
                },
            });
    
            return bookingWithDetails;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};