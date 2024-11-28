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

// src/controller/userController.ts
var userController_exports = {};
__export(userController_exports, {
  createUser: () => createUser,
  deleteUser: () => deleteUser,
  getUniqueUser: () => getUniqueUser,
  loginOrCreateUser: () => loginOrCreateUser
});
module.exports = __toCommonJS(userController_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser,
  deleteUser,
  getUniqueUser,
  loginOrCreateUser
});
