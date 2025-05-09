import express from "express";
import {
createAssessment,
  updateAssessment,
  deleteAssessment,
} from "../controllers/assessmentController";

const router = express.Router();

// POST /reviews - Criar avaliação
router.post("/", createAssessment);

// PUT /reviews/:id - Editar avaliação
router.put("/:id", updateAssessment);

// DELETE /reviews/:id - Excluir avaliação
router.delete("/:id", deleteAssessment);


export default router;