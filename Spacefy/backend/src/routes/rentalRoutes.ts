import express from "express";
import {
  createRental,
  getAllRentals,
  getRentalsByUser,
  deleteRental,
  getRentedDatesBySpace,
} from "../controllers/rentalController";
import { validateAndGetTokenData } from "../middlewares/token";

const router = express.Router();

// Todas as rotas agora requerem autenticação
router.post("/", validateAndGetTokenData, createRental);
router.get("/", validateAndGetTokenData, getAllRentals);
router.get("/user/:userId", validateAndGetTokenData, getRentalsByUser);
router.get("/space/:spaceId/dates", getRentedDatesBySpace);
router.delete("/:rentalId", validateAndGetTokenData, deleteRental);

export default router;
