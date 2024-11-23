import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { calculateRoute } from "../services/calculateRoute"; 


export const confirmRide = async (req: Request, res: Response): Promise<void> => {
  const { customerId, origin, destination, driver } = req.body;

  if (!origin || !destination || !customerId || !driver) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

  if (origin === destination) {
    res.status(400).json({ error: "Os endereços de origem e destino não podem ser iguais." });
    return;
  }

  const selectedDriver = await prisma.driver.findUnique({
    where: { id: driver.id },
  });

  if (!selectedDriver) {
    res.status(404).json({ error: "Motorista não encontrado." });
    return;
  }

  // Obter distância e duração da API do Google Maps
  const routeData = await calculateRoute(origin, destination);

  if (!routeData) {
    res.status(400).json({ error: "Não foi possível calcular a rota." });
    return;
  }

  const { distance, duration } = routeData;

  const distanceInKm = distance / 1000; 
  const durationInMin = (duration / 60).toFixed(2);

  // baseado na distância e na taxa do motorista
  const calculatedValue = parseFloat((distanceInKm * (selectedDriver.ratePerKm || 3)).toFixed(2));

  // Salvar
  try {
    await prisma.ride.create({
      data: {
        customerId: customerId,
        origin,
        destination,
        distance: distanceInKm,
        duration: `${durationInMin} min`,
        driverId: driver.id,
        value: calculatedValue, 
      },
    });

    res.status(200).json({ message: "Viagem confirmada com sucesso.", value: calculatedValue });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar a viagem." });
  }
};
