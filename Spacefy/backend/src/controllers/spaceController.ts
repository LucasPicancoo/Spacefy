import { Request, Response } from "express";
import SpaceModel from "../models/spaceModel";

// Listar todos os espaços
export const getAllSpaces = async (req: Request, res: Response) => {
  try {
    const spaces = await SpaceModel.find();
    res.status(200).json(spaces);
  } catch (error) {
    console.error("Erro ao listar espaços:", error);
    res.status(500).json({ error: "Erro ao listar espaços" });
  }
};

// Obter um espaço por ID
export const getSpaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const space = await SpaceModel.findById(id);

    if (!space) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    res.status(200).json(space);
  } catch (error) {
    console.error("Erro ao buscar espaço:", error);
    res.status(500).json({ error: "Erro ao buscar espaço" });
  }
};

// Criar um novo espaço
export const createSpace = async (req: Request, res: Response) => {
  try {
    const {
      space_name,
      max_people,
      location,
      space_type,
      space_description,
      price_per_hour,
      owner_name,
      document_number,
      owner_phone,
      email,
      image_url,
    } = req.body;

    // Verifica se todos os campos obrigatórios foram enviados
    if (
      !space_name ||
      !max_people ||
      !location ||
      !space_type ||
      !price_per_hour ||
      !owner_name ||
      !document_number ||
      !owner_phone ||
      !email ||
      !image_url
    ) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Cria um novo espaço
    const newSpace = new SpaceModel({
      space_name,
      max_people,
      location,
      space_type,
      space_description,
      price_per_hour,
      owner_name,
      document_number,
      owner_phone,
      email,
      image_url,
    });

    await newSpace.save();
    res.status(201).json(newSpace);
  } catch (error) {
    console.error("Erro ao criar espaço:", error);

    // Verifica se o erro é de validação
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Erro ao criar espaço" });
  }
};

// Atualizar um espaço por ID
export const updateSpace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedSpace = await SpaceModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedSpace) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    res.status(200).json(updatedSpace);
  } catch (error) {
    console.error("Erro ao atualizar espaço:", error);

    // Verifica se o erro é de validação
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Erro ao atualizar espaço" });
  }
};

// Excluir um espaço por ID
export const deleteSpace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSpace = await SpaceModel.findByIdAndDelete(id);

    if (!deletedSpace) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    res.status(200).json({ message: "Espaço excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir espaço:", error);
    res.status(500).json({ error: "Erro ao excluir espaço" });
  }
};
