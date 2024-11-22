import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUniqueUser,
} from "./controller/userController";
import { createDriver, getAllDrivers, getUniqueDriver } from "./controller/driverController";

export const router = Router();

// Rotas de usuário
router.post("/register", createUser);
router.delete("/delete-user", deleteUser);
router.get("/get-all-users", getAllUser);
router.get("/get-unique-user/:id", getUniqueUser);

// Rotas do motorista
router.post("/newdriver", createDriver)
router.get("/drivers", getAllDrivers)
router.get("/get-unique-driver/:id", getUniqueDriver)