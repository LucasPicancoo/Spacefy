import { Request, Response, NextFunction } from "express";
import { AuthenticationData } from "../types/auth";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthenticationData;
  }
}

export const validateAndGetTokenData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token de autenticação ausente." });
    return
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as AuthenticationData;

    req.auth = decoded;
    next();
    return
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
    return
  }
};