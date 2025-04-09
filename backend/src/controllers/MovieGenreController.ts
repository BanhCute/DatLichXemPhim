import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMovieGenres = async (req, res) => {
  try {
    const movieGenres = await prisma.movieGenre.findMany({
      include: { movie: true, genre: true },
    });
    res.json(movieGenres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMovieGenre = async (req, res) => {
  try {
    const { movieId, genreId } = req.body;
    const movieGenre = await prisma.moviegenre.create({
      data: { movieId, genreId },
    });
    res.json(movieGenre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};