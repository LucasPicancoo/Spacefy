// routes/blockedDateRoutes.ts
import express from "express";
import {
  blockDate,
  getBlockedDatesBySpace,
  unblockDate,
} from "../controllers/blockedDateController";
import { validateAndGetTokenData } from "../middlewares/token";

const router = express.Router();

router.post("/block", validateAndGetTokenData, blockDate);
router.get("/:spaceId", getBlockedDatesBySpace);
router.delete("/unblock", validateAndGetTokenData, unblockDate);

export default router;
