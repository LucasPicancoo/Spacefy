import { Request, Response } from "express";
import viewhistoryModel from "../models/viewhistoryModel";

// Regitro de Vizualização
export const registerViewHistory = async (req: Request, res: Response) => {
  try {
    const { user_id, space_id } = req.body;

    if (!user_id || !space_id) {
      return res
        .status(400)
        .json({ error: "user_id e space_id são obrigatórios." });
    }

    // Evitar possíveis duplicatas recentes
    const existingView = await viewhistoryModel.findOne({ user_id, space_id });

    if (existingView) {
      existingView.viewed_at = new Date();
      await existingView.save();
      return res.status(200).json(existingView);
    }

    const newViewHistory = new viewhistoryModel({ user_id, space_id });
    await newViewHistory.save();

    res.status(201).json(newViewHistory);
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    res.status(500).json({ error: "Erro ao registrar visualização" });
  }
};

//Busca Historico de Vizualização
export const getViewHistoryByUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    // Converter limit e page para número (com fallback)
    const limit = parseInt(req.query.limit as string) || 10; // (padrão: 10)
    const page = parseInt(req.query.page as string) || 1; // (padrão: 1)

    if (!user_id) {
      return res.status(400).json({ error: "user_id é obrigatório." });
    }

    const history = await viewhistoryModel
      .find({ user_id })
      .sort({ viewed_at: -1 })
      .limit(limit)
      .skip((page - 1) * limit) // Cálculo correto de paginação
      .populate("space_id");

    res.status(200).json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar histórico de visualizações." });
  }
};
