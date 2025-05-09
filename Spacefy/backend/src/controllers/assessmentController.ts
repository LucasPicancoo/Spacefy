import { Request, Response } from "express";
import Review from "../models/assessmentModel";

// Registrar uma avaliação
export const createAssessment = async (req: Request, res: Response) => {
  const { spaceId, userId, rating, comment } = req.body;

  if (rating < 0 || rating > 5) {
     res.status(400).json({ error: "A nota deve ser entre 0 e 5 estrelas." });
  }

  try {
    const review = await Review.create({ spaceId, userId, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar avaliação." });
  }
};

// Editar uma avaliação
export const updateAssessment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (rating && (rating < 0 || rating > 5)) {
     res.status(400).json({ error: "A nota deve ser entre 0 e 5 estrelas." });
  }

  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true } // Retorna a versão atualizada
    );
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar avaliação." });
  }
};

// Excluir uma avaliação
export const deleteAssessment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Avaliação excluída com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir avaliação." });
  }
};

