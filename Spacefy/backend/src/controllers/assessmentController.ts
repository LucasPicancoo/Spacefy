import { Request, Response } from "express";
import Review from "../models/assessmentModel";
import mongoose from "mongoose";
import { IBaseUser } from "../types/user";
import connectDB from "../config/database";

// Registrar uma avaliação
export const createAssessment = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const { spaceID, userID, score, comment } = req.body || {};

    // Verificação de campos obrigatórios
    if (!spaceID || !userID || score === undefined) {
      res.status(400).json({ error: "Campos obrigatórios: spaceID, userID e score." });
      return;
    }

    // Validação da nota
    if (score < 0 || score > 5) {
      res.status(400).json({ error: "A nota deve ser entre 0 e 5 estrelas." });
      return;
    }

    // Validar se os IDs são ObjectIds válidos
    if (!mongoose.Types.ObjectId.isValid(spaceID)) {
      res.status(400).json({ error: "ID do espaço inválido." });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      res.status(400).json({ error: "ID do usuário inválido." });
      return;
    }

    const review = await Review.create({
      spaceID: new mongoose.Types.ObjectId(spaceID),
      userID: new mongoose.Types.ObjectId(userID),
      score,
      comment,
      evaluation_date: new Date()
    });

    res.status(201).json(review);
    return;
  } catch (error: any) {
    console.error("Erro ao criar avaliação:", error);
    
    if (error.code === 11000) {
      res.status(400).json({ 
        error: "Erro de duplicação. Detalhes: " + error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      error: "Erro ao criar avaliação.",
      details: error.message 
    });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

// Editar uma avaliação
export const updateAssessment = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const { id } = req.params;
    const { score, comment } = req.body || {};

    // Validação da nota
    if (score !== undefined && (score < 0 || score > 5)) {
      res.status(400).json({ error: "A nota deve ser entre 0 e 5 estrelas." });
      return;
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { score, comment },
      { new: true }
    );

    if (!review) {
      res.status(404).json({ error: "Avaliação não encontrada." });
      return;
    }

    res.status(200).json(review);
    return;
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    res.status(500).json({ error: "Erro ao atualizar avaliação." });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

// Excluir uma avaliação
export const deleteAssessment = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const { id } = req.params;

    // Busca a avaliação antes de excluir para verificar as permissões
    const assessment = await Review.findById(id);

    if (!assessment) {
      res.status(404).json({ error: "Avaliação não encontrada." });
      return;
    }

    // Verifica se o usuário é o dono da avaliação ou um administrador
    if (!req.auth || (req.auth.id !== assessment.userID.toString() && req.auth.role !== "admin")) {
      res.status(403).json({ 
        error: "Acesso negado. Apenas o autor da avaliação ou um administrador podem excluí-la." 
      });
      return;
    }

    const deleted = await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Avaliação excluída com sucesso." });
    return;
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error);
    res.status(500).json({ error: "Erro ao excluir avaliação." });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

// Buscar avaliações de um espaço específico
export const getAssessmentsBySpace = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const { spaceId } = req.params;

    // Validação do ID do espaço
    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      res.status(400).json({ error: "ID do espaço inválido." });
      return;
    }

    const assessments = await Review.find({ spaceID: spaceId })
      .populate({
        path: 'userID',
        select: 'name',
        model: 'user'
      })
      .lean();
    
    // Formatar os dados para retornar apenas o necessário
    const formattedAssessments = assessments.map(assessment => ({
      _id: assessment._id,
      score: assessment.score,
      comment: assessment.comment,
      evaluation_date: assessment.evaluation_date,
      userID: assessment.userID ? {
        _id: assessment.userID._id,
        name: (assessment.userID as IBaseUser).name
      } : null,
      spaceID: assessment.spaceID
    }));

    res.status(200).json(formattedAssessments);
    return;
  } catch (error: any) {
    console.error("Erro detalhado ao buscar avaliações:", error);
    res.status(500).json({ 
      error: "Erro ao buscar avaliações do espaço.",
      details: error.message 
    });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

export const getAllAssessments = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    if (!req.auth || req.auth.role !== "admin") {
      res.status(403).json({ error: "Acesso negado. Usuário não autorizado. somente admin pode acessar" });
      return;
    }
    const assessments = await Review.find();
    res.status(200).json(assessments);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar todas as avaliações." });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

export const getTopRatedSpaces = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const topSpaces = await Review.aggregate([
      {
        $group: {
          _id: "$spaceID",
          averageScore: { $avg: "$score" },
          totalReviews: { $sum: 1 }
        }
      },
      {
        $sort: { averageScore: -1 }
      },
      {
        $limit: 25
      },
      {
        $lookup: {
          from: "spaces",
          localField: "_id",
          foreignField: "_id",
          as: "spaceInfo"
        }
      },
      {
        $unwind: "$spaceInfo"
      },
      {
        $project: {
          _id: 1,
          averageScore: 1,
          totalReviews: 1,
          space_name: "$spaceInfo.space_name",
          location: "$spaceInfo.location",
          price_per_hour: "$spaceInfo.price_per_hour",
          image_url: "$spaceInfo.image_url"
        }
      }
    ]);

    res.status(200).json(topSpaces);
    return;
  } catch (error) {
    console.error("Erro ao buscar espaços melhor avaliados:", error);
    res.status(500).json({ error: "Erro ao buscar espaços melhor avaliados." });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

export const getAssessmentsByUser = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    // Validação do ID do usuário
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "ID do usuário inválido." });
      return;
    }

    // Busca o total de avaliações para calcular o total de páginas
    const totalAssessments = await Review.countDocuments({ userID: userId });
    const totalPages = Math.ceil(totalAssessments / limit);

    const assessments = await Review.find({ userID: userId })
      .populate({
        path: 'spaceID',
        select: 'space_name',
        model: 'Space'
      })
      .sort({ evaluation_date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      assessments,
      pagination: {
        currentPage: page,
        totalPages,
        totalAssessments,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
    return;
  } catch (error) {
    console.error("Erro ao buscar avaliações do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar avaliações do usuário." });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

export const getAverageScoreBySpace = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const { spaceId } = req.params;

    // Validação do ID do espaço
    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      res.status(400).json({ error: "ID do espaço inválido." });
      return;
    }

    const result = await Review.aggregate([
      {
        $match: {
          spaceID: new mongoose.Types.ObjectId(spaceId)
        }
      },
      {
        $group: {
          _id: "$spaceID",
          averageScore: { $avg: "$score" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    // Retorna média 0 se não houver avaliações
    if (result.length === 0) {
      res.status(200).json({
        spaceId,
        averageScore: 0,
        totalReviews: 0
      });
      return;
    }

    res.status(200).json({
      spaceId,
      averageScore: Number(result[0].averageScore.toFixed(1)),
      totalReviews: result[0].totalReviews
    });
    return;
  } catch (error) {
    console.error("Erro ao calcular média das avaliações:", error);
    res.status(500).json({ error: "Erro ao calcular média das avaliações do espaço." });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

