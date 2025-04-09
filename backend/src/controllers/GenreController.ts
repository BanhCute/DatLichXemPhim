import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllGenres = async (req, res) => {
  try {
    const genres = await prisma.genre.findMany();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const genre = await prisma.genre.create({
      data: { name },
    });
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};