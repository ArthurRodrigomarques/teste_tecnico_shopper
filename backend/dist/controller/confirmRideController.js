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

// src/controller/confirmRideController.ts
var confirmRideController_exports = {};
__export(confirmRideController_exports, {
  confirmRide: () => confirmRide
});
module.exports = __toCommonJS(confirmRideController_exports);

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  confirmRide
});
