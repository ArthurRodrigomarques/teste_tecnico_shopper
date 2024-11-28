import { Request, Response } from "express";
import { prisma } from "../database/prisma";

// Novo motorista
export const createDriver = async (req: Request, res: Response) => {
  const { name, description, vehicle, ratePerKm, minKm, rating } = req.body;

  try {
    const newDriver = await prisma.driver.create({
      data: { 
        name, 
        description, 
        vehicle, 
        rating, 
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
    const drivers = await prisma.driver.findMany();

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

