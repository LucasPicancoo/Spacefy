import express from "express";
import {
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAllAssessments,
  getAssessmentsBySpace,
  getTopRatedSpaces
} from "../controllers/assessmentController";
import { validateAndGetTokenData } from "../middlewares/token";

const router = express.Router();

router.post("/create", validateAndGetTokenData, createAssessment);
router.put("/update/:id", validateAndGetTokenData, updateAssessment);
router.delete("/delete/:id", validateAndGetTokenData, deleteAssessment);
router.get("/getAll", validateAndGetTokenData, getAllAssessments);
router.get("/space/:spaceId", getAssessmentsBySpace);
router.get("/top-rated", getTopRatedSpaces);

export default router; 