import { Request, Response } from "express";
import { prisma } from "../database/prisma";

// Função auxiliar para validação do motorista
const validateDriver = async (driverId: string | undefined) => {
  if (!driverId) return true;
  const validDriver = await prisma.driver.findUnique({
    where: { id: driverId },
  });
  return !!validDriver;
};

export const getCustomerRides = async (req: Request, res: Response): Promise<void> => {
  const { customerId } = req.params;
  const { driverId } = req.query;

  // Validação do ID do cliente
  console.log("Customer ID:", customerId)
  console.log("Driver ID:", driverId)
  if (!customerId) {
    res.status(400).json({
      error_code: "INVALID_CUSTOMER",
      error_description: "O ID do cliente não pode estar em branco.",
    });
    return;
  }

  // Validação do motorista, se informado
  const isDriverValid = await validateDriver(driverId as string | undefined);
  if (!isDriverValid) {
    res.status(400).json({
      error_code: "INVALID_DRIVER",
      error_description: "O ID do motorista informado é inválido.",
    });
    return;
  }

  try {
    // Busca das viagens
    const rides = await prisma.ride.findMany({
      where: {
        customerId,
        ...(driverId && { driverId: driverId as string }),
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // mais recente para a mais antiga
      },
    });

    // Verifica se há viagens
    if (rides.length === 0) {
      res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhum registro encontrado para o cliente.",
      });
      return;
    }

    // Mapeia e retorna as viagens
    res.status(200).json({
      customerId,
      rides: rides.map((ride) => ({
        id: ride.id,
        date: ride.createdAt,
        origin: ride.origin,
        destination: ride.destination,
        distance: ride.distance,
        duration: ride.duration,
        driver: ride.driver
          ? {
              id: ride.driver.id,
              name: ride.driver.name,
            }
          : null,
        value: ride.value,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar viagens:", error);
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao buscar viagens realizadas pelo usuário.",
    });
  }
};
