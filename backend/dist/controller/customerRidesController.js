"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controller/customerRidesController.ts
var customerRidesController_exports = {};
__export(customerRidesController_exports, {
  getCustomerRides: () => getCustomerRides
});
module.exports = __toCommonJS(customerRidesController_exports);

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCustomerRides
});
