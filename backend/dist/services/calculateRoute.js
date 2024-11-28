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

// src/services/calculateRoute.ts
var calculateRoute_exports = {};
__export(calculateRoute_exports, {
  calculateRoute: () => calculateRoute
});
module.exports = __toCommonJS(calculateRoute_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  calculateRoute
});
