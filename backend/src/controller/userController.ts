import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const loginOrCreateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { name, email },
      });
    }

    // Retorna o ID do usuário
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar ou buscar o usuário.", details: error });
  }
};


export const createUser = async (req: Request, res: Response) => {

  const { name, email } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });

    res.status(201).json(newUser);

  } catch (error) {
    res.status(400).json({ error: "Erro ao criar o usuário.", details: error });
  }
};


export const getUniqueUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const user = await prisma.user.findUnique({ where: { id } });
  
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
        return;
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar o usuário.", details: error });
    }
  };
  

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const user = await prisma.user.delete({ where: { id } });

    res.status(200).json({ message: "Usuário deletado com sucesso.", user });

  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar o usuário.", details: error });
  }
};

