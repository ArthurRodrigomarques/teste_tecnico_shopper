import { Request, Response } from "express";
import { calculateRoute } from "../services/calculateRoute";
import { prisma } from "../database/prisma";

// Estimar valor da corrida
export const estimateRide = async (req: Request, res: Response): Promise<any> => {
  const { origin, destination, driverId } = req.body;

  try {
    // Calcular a rota entre a origem e o destino
    const routeData = await calculateRoute(origin, destination);

    if (!routeData) {
      return res.status(400).json({ error: "Não foi possível calcular a rota." });
    }

    const { distance, duration, originCoordinates, destinationCoordinates } = routeData;

    const distanceInKm = distance / 1000;
    const durationInMin = duration / 60;

    // Buscar o motorista
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return res.status(404).json({ error: "Motorista não encontrado." });
    }

    const ratePerKm = driver.ratePerKm || 3; // Taxa 
    const estimatedValue = distanceInKm * ratePerKm;

    // latitude e longitude
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
      options: [
        {
          driverId,
          estimatedValue,
          distance: distanceInKm,
          duration: durationInMin.toFixed(2),
        },
      ],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: "Erro ao calcular a rota.", details: error.message });
    } else {
      return res.status(500).json({ error: "Erro desconhecido ao calcular a rota." });
    }
  }
};
