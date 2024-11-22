import { Request, Response } from "express";
import { prisma } from "../database/prisma";

// Novo motorista
export const createDriver = async (req: Request, res: Response) => {
  const { name, description, vehicle, ratePerKm, minKm } = req.body;

  try {
    const newDriver = await prisma.driver.create({
      data: { 
        name, 
        description, 
        vehicle, 
        ratePerKm, 
        minKm 
      },
    });

    res.status(201).json(newDriver);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar o motorista.", details: error });
  }
};

// Todos os motoristas
export const getAllDrivers = async (_req: Request, res: Response) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        ratings: true, 
      },
    });

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os motoristas.", details: error });
  }
};

// Motorista único
export const getUniqueDriver = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const driver = await prisma.driver.findUnique({
      where: { id: id }, 
      include: {
        ratings: true,
      },
    });

    if (!driver) {
      res.status(404).json({ error: "Motorista não encontrado." });
      return;
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o motorista.", details: error });
    return;
  }
};

// Atualiza a média de avaliações de um motorista
export const updateDriverRating = async (driverId: string) => { 
  const ratings = await prisma.rating.findMany({
    where: { driverId },
  });

  const averageRating =
    ratings.reduce((sum, rating) => sum + rating.stars, 0) / ratings.length || 0;

  await prisma.driver.update({
    where: { id: driverId },
    data: { rating: averageRating },
  });
};
