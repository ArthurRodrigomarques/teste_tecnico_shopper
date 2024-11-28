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

// src/controller/driverController.ts
var driverController_exports = {};
__export(driverController_exports, {
  createDriver: () => createDriver,
  getAllDrivers: () => getAllDrivers,
  getUniqueDriver: () => getUniqueDriver
});
module.exports = __toCommonJS(driverController_exports);

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDriver,
  getAllDrivers,
  getUniqueDriver
});
