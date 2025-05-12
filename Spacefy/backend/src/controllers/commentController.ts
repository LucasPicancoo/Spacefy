import { Request, Response } from "express";
import Comment from "../models/commentModel";

// Criar ou atualizar um comentário (se já existir uma avaliação do usuário)
export const createOrUpdateComment = async (req: Request, res: Response) => {
  const { spaceId, userId, text } = req.body;

  // Validações
  if (!spaceId || !userId || !text) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: spaceId, userId e text." });
  }

  try {
    // Verifica se já existe comentário do usuário para o espaço
    const existingComment = await Comment.findOneAndUpdate(
      { space_id: spaceId, user_id: userId },
      {
        text,
        isEdited: true,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    ).lean(); // .lean() para retornar objeto JavaScript simples

    return res
      .status(
        existingComment.createdAt === existingComment.updatedAt ? 201 : 200
      )
      .json(existingComment);
  } catch (error) {
    console.error("Erro ao salvar comentário:", error);
    return res.status(500).json({ error: "Erro ao salvar comentário." });
  }
};

// Editar apenas o comentário (sem alterar a avaliação)
export const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || text.length < 2 || text.length > 500) {
    return res.status(400).json({ error: "Texto inválido." });
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      {
        text,
        isEdited: true,
      },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Erro ao atualizar comentário:", error);
    return res.status(500).json({ error: "Erro ao atualizar comentário." });
  }
};

// Excluir um comentário (define o campo como null ou string vazia)
export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    return res
      .status(200)
      .json({ message: "Comentário excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir comentário:", error);
    return res.status(500).json({ error: "Erro ao excluir comentário." });
  }
};

// Buscar comentários de um espaço específico
export const getCommentsBySpace = async (req: Request, res: Response) => {
  const { spaceId } = req.params;

  try {
    const comments = await Comment.find({ space_id: spaceId })
      .populate("user_id", "name email") // Traz informações do usuário
      .sort({ createdAt: -1 }); // Ordena por data decrescente

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return res.status(500).json({ error: "Erro ao buscar comentários." });
  }
};
