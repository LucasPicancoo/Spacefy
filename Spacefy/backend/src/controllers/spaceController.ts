import { Request, Response } from "express";
import SpaceModel from "../models/spaceModel";
import { AMENITIES, ALLOWED_AMENITIES } from "../constants/amenities";
import { ALLOWED_RULES } from "../constants/spaceRules";

// import { AuthenticationData } from "../types/auth";

// Listar todos os espaços
export const getAllSpaces = async (req: Request, res: Response) => {
  try {
    const spaces = await SpaceModel.find();

    if (!spaces) {
      res.status(404).json({ error: "Nenhum espaço encontrado" });
    }

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

    return res.status(200).json(space);
  } catch (error) {
    console.error("Erro ao buscar espaço:", error);
    return res.status(500).json({ error: "Erro ao buscar espaço" });
  }
};

// Criar um novo espaço
export const createSpace = async (req: Request, res: Response) => {
  try {
    // Para que somente locatários possam criar espaços
    if (req.auth?.role !== "locatario") {
      return res
        .status(403)
        .json({ error: "Apenas locatários podem criar espaços." });
    }
    const {
      space_name,
      max_people,
      location,
      space_type,
      space_description,
      space_amenities,
      week_days,
      opening_time,
      closing_time,
      space_rules,
      price_per_hour,
      owner_name,
      document_number,
      owner_phone,
      owner_email,
      image_url,
    } = req.body;

    // Verifica se todos os campos obrigatórios foram enviados
    if (
      !space_name ||
      !max_people ||
      !location ||
      !space_type ||
      !price_per_hour ||
      !space_amenities ||
      !week_days ||
      !opening_time ||
      !closing_time ||
      !owner_name ||
      !document_number ||
      !owner_phone ||
      !owner_email ||
      !image_url
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Verifica se todas as comodidades são permitidas
    const invalidAmenities = space_amenities.filter(
      (amenity: string) => !ALLOWED_AMENITIES.includes(amenity)
    );

    if (invalidAmenities.length > 0) {
      return res.status(400).json({
        error: "Comodidades inválidas encontradas",
        invalidAmenities
      });
    }

    // Verifica se todas as regras são permitidas (apenas se foram fornecidas)
    if (space_rules && space_rules.length > 0) {
      const invalidRules = space_rules.filter(
        (rule: string) => !ALLOWED_RULES.includes(rule)
      );

      if (invalidRules.length > 0) {
        return res.status(400).json({
          error: "Regras inválidas encontradas",
          invalidRules
        });
      }
    }

    // Cria um novo espaço
    const newSpace = new SpaceModel({
      space_name,
      max_people,
      location,
      space_type,
      space_description,
      space_amenities,
      week_days,
      opening_time,
      closing_time,
      space_rules,
      price_per_hour,
      owner_name,
      document_number,
      owner_phone,
      owner_email,
      image_url,
    });

    await newSpace.save();
    res.status(201).json(newSpace);
  } catch (error) {
    console.error("Erro ao criar espaço:", error);

    // Verifica se o erro é de validação
    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({ error: "Erro de validação dos campos" });
    }

    return res.status(500).json({ error: "Erro ao criar espaço" });
  }
};

// Atualizar um espaço por ID
export const updateSpace = async (req: Request, res: Response) => {
  try {
    // Para que somente locatários possam atualizar espaços
    if (req.auth?.role !== "locatario") {
      return res
        .status(403)
        .json({ error: "Apenas locatários podem atualizar espaços." });
    }

    const {
      space_name,
      max_people,
      location,
      space_type,
      price_per_hour,
      owner_name,
      document_number,
      owner_phone,
      owner_email,
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
      !owner_email ||
      !image_url
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    const { id } = req.params;
    const updatedSpace = await SpaceModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedSpace) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    return res.status(200).json(updatedSpace);
  } catch (error) {
    console.error("Erro ao atualizar espaço:", error);

    // Verifica se o erro é de validação do Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erro ao atualizar espaço" });
  }
};

// Excluir um espaço por ID
import mongoose from 'mongoose';

export const deleteSpace = async (req: Request, res: Response) => {
  try {
    if (!req.auth || !["locatario", "admin"].includes(req.auth.role)) {
      return res.status(403).json({
        error: "Apenas locatários ou administradores podem excluir espaços."
      });
    }

    const { id } = req.params;

    // Add validation for ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const deletedSpace = await SpaceModel.findByIdAndDelete(id);

    if (!deletedSpace) {
      return res.status(404).json({ error: "Espaço não encontrado" });
    }

    return res.status(200).json({
      message: "Espaço excluído com sucesso",
      deletedSpace
    });
  } catch (error) {
    console.error("Erro ao excluir espaço:", error);
    return res.status(500).json({
      error: "Erro ao excluir espaço",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}
