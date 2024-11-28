"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/router.ts
var router_exports = {};
__export(router_exports, {
  router: () => router
});
module.exports = __toCommonJS(router_exports);
var import_express = require("express");

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

// src/controller/userController.ts
var loginOrCreateUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      user = await prisma.user.create({
        data: { name, email }
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar ou buscar o usu\xE1rio.", details: error });
  }
};
var createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email }
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar o usu\xE1rio.", details: error });
  }
};
var getUniqueUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado." });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o usu\xE1rio.", details: error });
  }
};
var deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "Usu\xE1rio deletado com sucesso.", user });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar o usu\xE1rio.", details: error });
  }
};

// src/controller/driverController.ts
var createDriver = async (req, res) => {
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
      }
    });
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar o motorista.", details: error });
  }
};
var getAllDrivers = async (_req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os motoristas.", details: error });
  }
};
var getUniqueDriver = async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await prisma.driver.findUnique({
      where: { id }
    });
    if (!driver) {
      res.status(404).json({ error: "Motorista n\xE3o encontrado." });
      return;
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o motorista.", details: error });
    return;
  }
};

// src/services/calculateRoute.ts
var import_axios = __toESM(require("axios"));
var calculateRoute = async (origin, destination) => {
  const apikey = process.env.GOOGLE_API_KEY;
  try {
    const response = await import_axios.default.get("https://maps.googleapis.com/maps/api/directions/json", {
      params: {
        origin,
        destination,
        key: apikey
      }
    });
    const route = response.data.routes[0];
    if (!route) return null;
    const { distance, duration, start_location, end_location } = route.legs[0];
    return {
      distance: distance.value,
      duration: duration.value,
      originCoordinates: { lat: start_location.lat, lng: start_location.lng },
      destinationCoordinates: { lat: end_location.lat, lng: end_location.lng },
      googleResponse: response.data
    };
  } catch (error) {
    console.error("Erro ao calcular rota", error);
    return null;
  }
};

// src/controller/estimateRideController.ts
var estimateRide = async (req, res) => {
  const { origin, destination, driverId } = req.body;
  try {
    const routeData = await calculateRoute(origin, destination);
    if (!routeData) {
      return res.status(400).json({ error: "N\xE3o foi poss\xEDvel calcular a rota." });
    }
    const { distance, duration, originCoordinates, destinationCoordinates, googleResponse } = routeData;
    const distanceInKm = distance / 1e3;
    const durationInMin = duration / 60;
    const drivers = await prisma.driver.findMany({
      orderBy: {
        ratePerKm: "asc"
        // Ordenar do mais barato para o mais caro
      }
    });
    const driverList = drivers.map((driver) => {
      const totalCost = distanceInKm * (driver.ratePerKm || 3);
      return {
        driverId: driver.id,
        name: driver.name,
        description: driver.description,
        car: driver.vehicle,
        rating: driver.rating,
        totalCost
      };
    });
    return res.status(200).json({
      origin: {
        latitude: originCoordinates.lat,
        longitude: originCoordinates.lng
      },
      destination: {
        latitude: destinationCoordinates.lat,
        longitude: destinationCoordinates.lng
      },
      distance: distanceInKm,
      duration: durationInMin.toFixed(2),
      drivers: driverList,
      googleRoute: googleResponse
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: "Erro ao calcular a rota.", details: error.message });
    } else {
      return res.status(500).json({ error: "Erro desconhecido ao calcular a rota." });
    }
  }
};

// src/controller/confirmRideController.ts
var confirmRide = async (req, res) => {
  const { customerId, origin, destination, driver } = req.body;
  if (!origin || !destination || !customerId || !driver) {
    res.status(400).json({ error: "Todos os campos s\xE3o obrigat\xF3rios." });
    return;
  }
  if (origin === destination) {
    res.status(400).json({ error: "Os endere\xE7os de origem e destino n\xE3o podem ser iguais." });
    return;
  }
  const selectedDriver = await prisma.driver.findUnique({
    where: { id: driver.id }
  });
  if (!selectedDriver) {
    res.status(404).json({ error: "Motorista n\xE3o encontrado." });
    return;
  }
  const routeData = await calculateRoute(origin, destination);
  if (!routeData) {
    res.status(400).json({ error: "N\xE3o foi poss\xEDvel calcular a rota." });
    return;
  }
  const { distance, duration } = routeData;
  const distanceInKm = distance / 1e3;
  const durationInMin = (duration / 60).toFixed(2);
  const calculatedValue = parseFloat((distanceInKm * (selectedDriver.ratePerKm || 3)).toFixed(2));
  try {
    await prisma.ride.create({
      data: {
        customerId,
        origin,
        destination,
        distance: distanceInKm,
        duration: `${durationInMin} min`,
        driverId: driver.id,
        value: calculatedValue
      }
    });
    res.status(200).json({ message: "Viagem confirmada com sucesso.", value: calculatedValue });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar a viagem." });
  }
};

// src/controller/customerRidesController.ts
var validateDriver = async (driverId) => {
  if (!driverId) return true;
  const validDriver = await prisma.driver.findUnique({
    where: { id: driverId }
  });
  return !!validDriver;
};
var getCustomerRides = async (req, res) => {
  const { customerId } = req.params;
  const { driverId } = req.query;
  console.log("Customer ID:", customerId);
  console.log("Driver ID:", driverId);
  if (!customerId) {
    res.status(400).json({
      error_code: "INVALID_CUSTOMER",
      error_description: "O ID do cliente n\xE3o pode estar em branco."
    });
    return;
  }
  const isDriverValid = await validateDriver(driverId);
  if (!isDriverValid) {
    res.status(400).json({
      error_code: "INVALID_DRIVER",
      error_description: "O ID do motorista informado \xE9 inv\xE1lido."
    });
    return;
  }
  try {
    const rides = await prisma.ride.findMany({
      where: {
        customerId,
        ...driverId && { driverId }
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
        // mais recente para a mais antiga
      }
    });
    if (rides.length === 0) {
      res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhum registro encontrado para o cliente."
      });
      return;
    }
    res.status(200).json({
      customerId,
      rides: rides.map((ride) => ({
        id: ride.id,
        date: ride.createdAt,
        origin: ride.origin,
        destination: ride.destination,
        distance: ride.distance,
        duration: ride.duration,
        driver: ride.driver ? {
          id: ride.driver.id,
          name: ride.driver.name
        } : null,
        value: ride.value
      }))
    });
  } catch (error) {
    console.error("Erro ao buscar viagens:", error);
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao buscar viagens realizadas pelo usu\xE1rio."
    });
  }
};

// src/router.ts
var router = (0, import_express.Router)();
router.post("/register", createUser);
router.post("/login-or-create-user", loginOrCreateUser);
router.delete("/delete-user", deleteUser);
router.get("/get-unique-user/:id", getUniqueUser);
router.post("/newdriver", createDriver);
router.get("/drivers", getAllDrivers);
router.get("/get-unique-driver/:id", getUniqueDriver);
router.post("/ride/estimate", estimateRide);
router.patch("/ride/confirm", confirmRide);
router.get("/ride/:customerId", getCustomerRides);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  router
});
