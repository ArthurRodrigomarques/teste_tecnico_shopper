import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUniqueUser,
  loginOrCreateUser,
} from "./controller/userController";
import { createDriver, getAllDrivers, getUniqueDriver } from "./controller/driverController";
import { estimateRide } from "./controller/estimateRideController";
import { confirmRide } from "./controller/confirmRideController";
import { getCustomerRides } from "./controller/customerRidesController";

export const router = Router();

// Rotas de usuário
router.post("/register", createUser);
router.post("/login-or-create-user", loginOrCreateUser); 
router.delete("/delete-user", deleteUser);
router.get("/get-all-users", getAllUser);
router.get("/get-unique-user/:id", getUniqueUser);

// Rotas do motorista
router.post("/newdriver", createDriver);
router.get("/drivers", getAllDrivers);
router.get("/get-unique-driver/:id", getUniqueDriver);


// rota para estimativa de viagem
router.post("/ride/estimate", estimateRide);
//rota para confirmar a viagem
router.patch("/ride/confirm", confirmRide);
// Rota para obter as viagens de um cliente
router.get("/ride/:customerId", getCustomerRides);