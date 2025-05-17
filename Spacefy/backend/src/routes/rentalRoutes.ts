import express from "express";
import {
  createRental,
  getAllRentals,
  getRentalsByUser,
  deleteRental,
} from "../controllers/rentalController";
import { validateAndGetTokenData } from "../middlewares/token";

const router = express.Router();

router.post("/", createRental);
router.get("/", getAllRentals);
router.get("/user/:userId", validateAndGetTokenData, getRentalsByUser);
router.delete("/:rentalId", validateAndGetTokenData, deleteRental);

export default router;
