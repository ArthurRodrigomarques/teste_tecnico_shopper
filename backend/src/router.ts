import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUniqueUser,
} from "./controller/userController";

export const router = Router();

// Rotas de usuário
router.post("/register", createUser);
router.delete("/delete-user", deleteUser);
router.get("/get-all-users", getAllUser);
router.get("/get-unique-user/:id", getUniqueUser);
