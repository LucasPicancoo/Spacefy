import express from "express";
import {
createAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentsBySpace,
} from "../controllers/assessmentController";

const router = express.Router();

// POST /reviews - Criar avaliação
router.post("/", createAssessment);

// PUT /reviews/:id - Editar avaliação
router.put("/:id", updateAssessment);

// DELETE /reviews/:id - Excluir avaliação
router.delete("/:id", deleteAssessment);

// GET /assessment/space/:spaceId - Buscar avaliações de um espaço
router.get("/space/:spaceId", getAssessmentsBySpace);


export default router;