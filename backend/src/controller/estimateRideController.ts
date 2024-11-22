import { Request, Response } from "express";
import { calculateRoute } from "../services/calculateRoute";
import { prisma } from "../database/prisma";

export const estimateRide = async (req: Request, res: Response): Promise<any> => {
  const { origin, destination, driverId } = req.body;

  try {
    // Calcular a rota entre a origem e o destino
    const routeData = await calculateRoute(origin, destination);

    if (!routeData) {
      return res.status(400).json({ error: "Não foi possível calcular a rota." });
    }

    const { distance, duration, originCoordinates, destinationCoordinates, googleResponse } = routeData;

    const distanceInKm = distance / 1000;
    const durationInMin = duration / 60;

    // Buscar motoristas disponíveis
    const drivers = await prisma.driver.findMany({
      orderBy: {
        ratePerKm: 'asc', // Ordenar do mais barato para o mais caro
      },
    });

    const driverList = drivers.map(driver => {
      const totalCost = distanceInKm * (driver.ratePerKm || 3);
      return {
        driverId: driver.id,
        name: driver.name,
        description: driver.description,
        car: driver.vehicle,
        rating: driver.rating,
        totalCost,
      };
    });

    return res.status(200).json({
      origin: {
        latitude: originCoordinates.lat,
        longitude: originCoordinates.lng,
      },
      destination: {
        latitude: destinationCoordinates.lat,
        longitude: destinationCoordinates.lng,
      },
      distance: distanceInKm,
      duration: durationInMin.toFixed(2), 
      drivers: driverList,
      googleRoute: googleResponse,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: "Erro ao calcular a rota.", details: error.message });
    } else {
      return res.status(500).json({ error: "Erro desconhecido ao calcular a rota." });
    }
  }
};
