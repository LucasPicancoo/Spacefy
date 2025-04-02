// controllers/spaceController.ts - Controlador para gerenciar espaços
import { Request, Response } from "express";
import Space from "../models/Space";

// Buscar todos os espaços disponíveis
export const getAllSpaces = async (req: Request, res: Response) => {
  const spaces = await Space.findAll();
  res.json(spaces);
};

// Buscar um espaço específico pelo ID
export const getSpaceById = async (req: Request, res: Response) => {
  const space = await Space.findByPk(req.params.id);
  if (!space) return res.status(404).json({ error: "Espaço não encontrado" });
  res.json(space);
};

// Criar um novo espaço (apenas locatários podem fazer isso)
export const createSpace = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "locatario") {
    return res
      .status(403)
      .json({ error: "Apenas locatários podem cadastrar espaços" });
  }

  const { name, category, location, price, capacity, description } = req.body;
  const newSpace = await Space.create({
    name,
    category,
    location,
    price,
    capacity,
    description,
    ownerId: req.user.id, // Agora `req.user.id` não gera erro
  });

  res.status(201).json(newSpace);
};
