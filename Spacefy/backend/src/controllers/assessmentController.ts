import { Request, Response } from "express";
import Review from "../models/assessmentModel";

// Registrar uma avaliação
export const createAssessment = async (req: Request, res: Response) => {
  const { spaceId, userId, rating, comment } = req.body || {};

  // Verificação de campos obrigatórios
  if (!spaceId || !userId || rating === undefined) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: spaceId, userId e rating." });
  }

  // Validação da nota
  if (rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ error: "A nota deve ser entre 0 e 5 estrelas." });
  }

  try {
    const review = await Review.create({ spaceId, userId, rating, comment });
    return res.status(201).json(review);
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    return res.status(500).json({ error: "Erro ao criar avaliação." });
  }
};

// Editar uma avaliação
export const updateAssessment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body || {};

  // Validação da nota
  if (rating !== undefined && (rating < 0 || rating > 5)) {
    return res
      .status(400)
      .json({ error: "A nota deve ser entre 0 e 5 estrelas." });
  }

  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Avaliação não encontrada." });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    return res.status(500).json({ error: "Erro ao atualizar avaliação." });
  }
};

// Excluir uma avaliação
export const deleteAssessment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Avaliação não encontrada." });
    }

    return res.status(200).json({ message: "Avaliação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error);
    return res.status(500).json({ error: "Erro ao excluir avaliação." });
  }
};

// Buscar avaliações de um espaço específico
export const getAssessmentsBySpace = async (req: Request, res: Response) => {
  const { spaceId } = req.params;

  try {
    const assessments = await Review.find({ spaceId });
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar avaliações do espaço." });
  }
};
