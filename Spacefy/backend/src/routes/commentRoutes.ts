import express from "express";
import {
  createOrUpdateComment,
  updateComment,
  deleteComment,
  getCommentsBySpace,
} from "../controllers/commentController";

const router = express.Router();

// POST /comments
router.post("/", createOrUpdateComment);

// PUT /comments/:id
router.put("/:id", updateComment);

// DELETE /comments/:id
router.delete("/:id", deleteComment);

// GET /comments/space/:spaceId
router.get("/space/:spaceId", getCommentsBySpace);

export default router;
