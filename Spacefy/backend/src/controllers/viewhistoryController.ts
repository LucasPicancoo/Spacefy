import { Request, Response } from "express";
import viewhistoryModel from "../models/viewhistoryModel";

// Registro de Visualização
export const registerViewHistory = async (req: Request, res: Response) => {
  try {
    const { user_id, space_id } = req.body;

    if (!user_id || !space_id) {
      return res
        .status(400)
        .json({ error: "user_id e space_id são obrigatórios." });
    }

    const newViewHistory = new viewhistoryModel({ user_id, space_id });
    await newViewHistory.save();

    res.status(201).json(newViewHistory);
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    res.status(500).json({ error: "Erro ao registrar visualização" });
  }
};

// Busca Histórico de Visualização
export const getViewHistoryByUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: "user_id é obrigatório." });
    }

    const history = await viewhistoryModel
      .find({ user_id })
      .sort({ createdAt: -1 }) // ordena do mais recente para o mais antigo
      .limit(10) // limita aos 10 últimos
      .populate("space_id"); // opcional

    res.status(200).json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar histórico de visualizações." });
  }
};
