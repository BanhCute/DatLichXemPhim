import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.genre.findMany();
  },

  Create: async function (req) {
    try {
        let { name } = req.body;
        let genre = await prisma.genre.create({
            data: { name },
        });
        return genre;
    } catch (error) {
        throw new Error(error.message);
    }
  },
};