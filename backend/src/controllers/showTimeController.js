let { PrismaClient } = require("@prisma/client");
const { GetById } = require("./movieController");
require("dotenv").config();

const prisma = new PrismaClient();

module.exports = {
    GetAll: async function () {
        return await prisma.showTime.findMany({
            include: {
                movie: true,
                seats: true,
            },
        });
    },

    GetByMovie: async function (req) {
        return await prisma.showTime.findMany({
            where: { movieId: parseInt(req.params.movieId) },
            include: {
                seats: true,
            },
        });
    },

    GetById: async function (req) {
        try {
            let showTime = await prisma.showTime.findUnique({
                where: { id: parseInt(req.params.id) },
                include: {
                    movie: true,
                    seats: true,
                    bookings: {
                        include: {
                            seats: true,
                        },
                    },
                },
            });
        
            if (!showTime) {
                throw new Error("Khong tim thay suat chieu");
            }
            return showTime;
        } catch (error) {
            throw new Error(error.message);
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
};