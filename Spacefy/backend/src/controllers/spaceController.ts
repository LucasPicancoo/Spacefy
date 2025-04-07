import { Request, Response } from "express";
import Space from "../models/spaceModel";
export const getAllSpaces = async (req: Request, res: Response) => {
  const spaces = await Space.find();
  res.json(spaces);
};

interface SpaceParams extends Request {
  params: {
    id: string;
  };
  id: string;
}

export const getSpaceById = async (req: Request, res: Response) => {
  const space = await Space.findById(req.params.id);
  if (!space) return res.status(404).json({ error: "Espaço não encontrado" });
  res.json(space);
};

interface SpaceRequest extends Request {
  body: {
    name: string;
    category: string;
    location: string;
    price: number;
    capacity: number;
    description: string;
  };
}

export const createSpace = async (req: Request, res: Response) => {
  if (!req.user || req.user?.role !== "locatario") {
    return res
      .status(403)
      .json({ error: "Apenas locatários podem cadastrar espaços" });
  }
  const { name, category, location, price, capacity, description } = req.body;
  const newSpace = new Space({
    name,
    category,
    location,
    price,
    capacity,
    description,
    ownerId: req.user?.id,
  });
  await newSpace.save();
  res.status(201).json(newSpace);
};
