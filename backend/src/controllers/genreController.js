let { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  GetAll: async function () {
    return await prisma.genre.findMany();
  },

  Create: async function (name) {
    try {
        let genre = await prisma.genre.create({
            data: { name: name },
        });
        return genre;
    } catch (error) {
        throw new Error(error.message);
    }
  },
};