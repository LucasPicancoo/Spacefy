import { Request, Response, NextFunction } from "express";

// Middleware que garante que o usuário seja Admin
export const ensureAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.auth?.role !== "admin") {
    return res.status(403).json({
      error:
        "Acesso negado. Apenas administradores podem acessar essa funcionalidade.",
    });
  }

  next(); // Se for admin, passa para o próximo middleware ou controller
};
