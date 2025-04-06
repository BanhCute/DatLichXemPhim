let { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

module.exports = {
    GetAll: async function () {
        return await prisma.movie.findMany({
            include: {
              showTimes: true,
            },
        });
    },

    GetById: async function (req) {
        return await prisma.movie.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                showTimes: {
                    include: {
                        seats: true,
                    },
                },
            },
        });
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