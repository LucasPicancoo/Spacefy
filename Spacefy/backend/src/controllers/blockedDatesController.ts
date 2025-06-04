import { Request, Response } from "express";
import BlockedDatesModel from "../models/blockedDatesModel";
import mongoose from "mongoose";

// Criar ou atualizar datas bloqueadas
export const createOrUpdateBlockedDates = async (req: Request, res: Response) => {
  try {
    const { space_id, blocked_dates } = req.body;

    // Validação do ID do espaço
    if (!mongoose.Types.ObjectId.isValid(space_id)) {
      res.status(400).json({ error: "ID do espaço inválido" });
      return;
    }

    // Validação das datas
    if (!Array.isArray(blocked_dates)) {
      res.status(400).json({ error: "É necessário fornecer um array de datas bloqueadas" });
      return;
    }

    // Converte as strings de data para objetos Date e valida
    const formattedDates = blocked_dates.map(date => new Date(date));
    
    // Verifica se há datas inválidas
    const invalidDates = formattedDates.filter(date => isNaN(date.getTime()));
    if (invalidDates.length > 0) {
      res.status(400).json({ error: "Formato de data inválido" });
      return;
    }

    // Verifica se há datas do passado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pastDates = formattedDates.filter(date => date < today);
    if (pastDates.length > 0) {
      res.status(400).json({ error: "Não é possível bloquear datas do passado" });
      return;
    }

    // Remove datas duplicadas
    const uniqueDates = formattedDates.filter((date, index, self) =>
      index === self.findIndex((d) => d.getTime() === date.getTime())
    );

    // Busca ou cria um novo registro de datas bloqueadas
    const blockedDates = await BlockedDatesModel.findOneAndUpdate(
      { space_id },
      { 
        space_id,
        blocked_dates: uniqueDates
      },
      { 
        new: true,
        upsert: true,
        select: 'space_id blocked_dates'
      }
    );

    res.status(200).json(blockedDates);
    return;
  } catch (error) {
    console.error("Erro ao criar/atualizar datas bloqueadas:", error);
    res.status(500).json({ 
      error: "Erro ao criar/atualizar datas bloqueadas",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return;
  }
};

// Obter datas bloqueadas por ID do espaço
export const getBlockedDatesBySpaceId = async (req: Request, res: Response) => {
  try {
    const { space_id } = req.params;

    // Validação do ID do espaço
    if (!mongoose.Types.ObjectId.isValid(space_id)) {
      res.status(400).json({ error: "ID do espaço inválido" });
      return;
    }

    const blockedDates = await BlockedDatesModel.findOne({ space_id })
      .populate({
        path: 'space_id',
        select: 'owner_id',
        populate: {
          path: 'owner_id',
          select: '_id'
        }
      })
      .select('space_id blocked_dates');

    if (!blockedDates) {
      res.status(404).json({ error: "Nenhuma data bloqueada encontrada para este espaço" });
      return;
    }

    res.status(200).json(blockedDates);
    return;
  } catch (error) {
    console.error("Erro ao buscar datas bloqueadas:", error);
    res.status(500).json({ 
      error: "Erro ao buscar datas bloqueadas",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return;
  }
}; 