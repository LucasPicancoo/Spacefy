import { Request, Response } from "express";
import RentalModel from "../models/rentalModel";
import mongoose from "mongoose";

// Função para verificar se há conflito de horário
const hasTimeConflict = (
  existingStart: string,
  existingEnd: string,
  newStart: string,
  newEnd: string
) => {
  return (
    (newStart >= existingStart && newStart < existingEnd) ||
    (newEnd > existingStart && newEnd <= existingEnd) ||
    (newStart <= existingStart && newEnd >= existingEnd)
  );
};

// Criar um novo aluguel com validação de conflito
export const createRental = async (req: Request, res: Response) => {
  try {
    const { userId, spaceId, date, startTime, endTime } = req.body;

    if (!userId || !spaceId || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Validar IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(spaceId)
    ) {
      return res.status(400).json({ error: "ID inválido." });
    }

    // Verificar conflitos no mesmo espaço e data
    const rentalsOnSameDate = await RentalModel.find({
      space: spaceId,
      date: new Date(date),
    });

    for (const rental of rentalsOnSameDate) {
      if (
        hasTimeConflict(
          rental.startTime,
          rental.endTime,
          startTime,
          endTime
        )
      ) {
        return res.status(409).json({
          error: "Conflito de horário: já existe um aluguel nesse espaço neste horário.",
        });
      }
    }

    const rental = new RentalModel({
      user: userId,
      space: spaceId,
      date,
      startTime,
      endTime,
    });

    await rental.save();
    return res.status(201).json(rental);
  } catch (error) {
    console.error("Erro ao criar aluguel:", error);
    return res.status(500).json({ error: "Erro interno ao criar aluguel." });
  }
};

// Listar todos os aluguéis com filtro opcional por data e espaço
export const getAllRentals = async (req: Request, res: Response) => {
  try {
    const { date, spaceId } = req.query;

    const filter: any = {};
    if (date) filter.date = new Date(date as string);
    if (spaceId && mongoose.Types.ObjectId.isValid(spaceId as string)) {
      filter.space = spaceId;
    }

    const rentals = await RentalModel.find(filter)
      .populate("user", "name email")
      .populate("space", "name location");

    return res.status(200).json(rentals);
  } catch (error) {
    console.error("Erro ao buscar aluguéis:", error);
    return res.status(500).json({ error: "Erro interno ao buscar aluguéis." });
  }
};

// Listar aluguéis de um usuário específico
export const getRentalsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID de usuário inválido." });
    }

    const rentals = await RentalModel.find({ user: userId })
      .populate("space", "name location");

    return res.status(200).json(rentals);
  } catch (error) {
    console.error("Erro ao buscar aluguéis do usuário:", error);
    return res.status(500).json({ error: "Erro interno ao buscar aluguéis." });
  }
};

// Deletar aluguel pelo ID
export const deleteRental = async (req: Request, res: Response) => {
  try {
    const { rentalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(rentalId)) {
      return res.status(400).json({ error: "ID de aluguel inválido." });
    }

    const deleted = await RentalModel.findByIdAndDelete(rentalId);

    if (!deleted) {
      return res.status(404).json({ error: "Aluguel não encontrado." });
    }

    return res.status(200).json({ message: "Aluguel deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar aluguel:", error);
    return res.status(500).json({ error: "Erro interno ao deletar aluguel." });
  }
};
