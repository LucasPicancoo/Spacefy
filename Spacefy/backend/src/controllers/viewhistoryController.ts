import { Request, Response } from "express";
import viewhistoryModel from "../models/viewhistoryModel";
import mongoose from "mongoose";

// Registro de Visualização
export const registerViewHistory = async (req: Request, res: Response) => {
  try {
    const { user_id, space_id } = req.body;

    if (!user_id || !space_id) {
      return res
        .status(400)
        .json({ error: "user_id e space_id são obrigatórios." });
    }

    // Validar se os IDs são válidos
    if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(space_id)) {
      return res.status(400).json({ error: "IDs inválidos fornecidos." });
    }

    // Verificar se já existe uma visualização
    const existingView = await viewhistoryModel.findOne({ user_id, space_id });

    if (existingView) {
      // Se já existe uma visualização, retorna ela sem atualizar a data
      return res.status(200).json({
        message: "Visualização já registrada anteriormente",
        view: existingView
      });
    }

    // Contar quantas visualizações o usuário já tem
    const viewCount = await viewhistoryModel.countDocuments({ user_id });

    // Se já tem 10 visualizações, remove a mais antiga
    if (viewCount >= 10) {
      const oldestView = await viewhistoryModel
        .findOne({ user_id })
        .sort({ viewed_at: 1 })
        .limit(1);

      if (oldestView) {
        await viewhistoryModel.deleteOne({ _id: oldestView._id });
      }
    }

    // Cria uma nova visualização
    const newViewHistory = new viewhistoryModel({ user_id, space_id });
    await newViewHistory.save();

    res.status(201).json(newViewHistory);
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    res.status(500).json({ 
      error: "Erro ao registrar visualização",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

// Busca Histórico de Visualização
export const getViewHistoryByUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "user_id inválido ou não fornecido." });
    }

    // Converter limit e page para número (com fallback)
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 10); // Máximo de 10 registros
    const page = Math.max(parseInt(req.query.page as string) || 1, 1); // Mínimo de 1
    const sort = (req.query.sort as string) || "-viewed_at"; // Ordenação padrão: mais recente primeiro

    // Calcular total de registros
    const total = await viewhistoryModel.countDocuments({ user_id });
    const totalPages = Math.ceil(total / limit);

    const history = await viewhistoryModel
      .find({ user_id })
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("space_id", "space_name image_url price_per_hour location");

    res.status(200).json({
      data: history,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ 
      error: "Erro ao buscar histórico de visualizações",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};
