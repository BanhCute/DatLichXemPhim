import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany();
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const { code, discount, startDate, endDate } = req.body;
    const promotion = await prisma.promotion.create({
      data: { code, discount, startDate, endDate },
    });
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};