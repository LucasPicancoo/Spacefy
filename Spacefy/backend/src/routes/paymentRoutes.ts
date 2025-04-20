import express from "express";
import { createPayment } from "../controllers/paymentController";

const router = express.Router();

router.post("/create", createPayment); // POST /payments/create

export default router;