import { Request, Response } from "express";
import BlockedDateModel from "../models/blockedDateModel";
import mongoose from "mongoose";
import { convertDate } from "./rentalController"; // Reaproveita sua função utilitária

// Bloquear uma nova data
export const blockDate = async (req: Request, res: Response) => {
  try {
    const { spaceId, date } = req.body;

    if (!spaceId || !date) {
      return res.status(400).json({ error: "spaceId e date são obrigatórios." });
    }

    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      return res.status(400).json({ error: "ID de espaço inválido." });
    }

    const parsedDate = convertDate(date);

    const existing = await BlockedDateModel.findOne({ space: spaceId, date: parsedDate });

    if (existing) {
      return res.status(409).json({ error: "Essa data já está bloqueada para este espaço." });
    }

    const blockedDate = await BlockedDateModel.create({ space: spaceId, date: parsedDate });

    return res.status(201).json(blockedDate);
  } catch (error) {
    console.error("Erro ao bloquear data:", error);
    return res.status(500).json({ error: "Erro interno ao bloquear data." });
  }
};

// Listar todas as datas bloqueadas de um espaço
export const getBlockedDatesBySpace = async (req: Request, res: Response) => {
  try {
    const { spaceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      return res.status(400).json({ error: "ID de espaço inválido." });
    }

    const blockedDates = await BlockedDateModel.find({ space: spaceId }).select("date");

    const dates = blockedDates.map((d: { date: { toISOString: () => string; }; }) => d.date.toISOString().split("T")[0]);

    return res.status(200).json({ blockedDates: dates });
  } catch (error) {
    console.error("Erro ao buscar datas bloqueadas:", error);
    return res.status(500).json({ error: "Erro interno ao buscar datas bloqueadas." });
  }
};

// Desbloquear (remover) uma data bloqueada
export const unblockDate = async (req: Request, res: Response) => {
    try {
      const { spaceId, date } = req.body;
  
      if (!spaceId || !date) {
        return res.status(400).json({ error: "spaceId e date são obrigatórios." });
      }
  
      if (!mongoose.Types.ObjectId.isValid(spaceId)) {
        return res.status(400).json({ error: "ID de espaço inválido." });
      }
  
      const parsedDate = convertDate(date);
  
      const deleted = await BlockedDateModel.findOneAndDelete({ space: spaceId, date: parsedDate });
  
      if (!deleted) {
        return res.status(404).json({ error: "Data bloqueada não encontrada para esse espaço." });
      }
  
      return res.status(200).json({ message: "Data desbloqueada com sucesso." });
    } catch (error) {
      console.error("Erro ao desbloquear data:", error);
      return res.status(500).json({ error: "Erro interno ao desbloquear data." });
    }
  };
  