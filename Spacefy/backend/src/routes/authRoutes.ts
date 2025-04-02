// routes/authRoutes.ts - Definição das rotas de autenticação
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, "secreto", {
    expiresIn: "1h",
  });
  res.json({ token });
});

export default authRouter;
