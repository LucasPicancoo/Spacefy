// Importa os tipos necessários do Express
import { Request, Response, NextFunction } from "express";
import { AuthenticationData } from "../types/auth";

// Importa o pacote jsonwebtoken para verificar o token JWT
import jwt from "jsonwebtoken";

// Estende o tipo Request do Express para incluir o campo `auth` com os dados do token decodificado e identificar se é usuario, locatário ou admin
declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthenticationData; // Dados do token decodificado
  }
}

// Middleware para validar e extrair os dados do token JWT
export const validateAndGetTokenData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Recupera o cabeçalho Authorization
  const authHeader = req.headers.authorization;

  // Se não existir, retorna erro 401 (não autorizado)
  if (!authHeader) {
    return res.status(401).json({ error: "Token de autenticação ausente." });
  }

  // Remove o prefixo "Bearer " do token
  const token = authHeader.replace("Bearer ", "");

  console.log("Token:", token); // Exibe o token recebido no console (para debug)

  try {
    // Verifica e decodifica o token usando a chave secreta definida no .env
    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY as string // Garante que a chave será tratada como string
    ) as AuthenticationData;

    // Adiciona os dados decodificados à requisição para uso nos próximos middlewares ou rotas
    req.auth = decoded;

    // Chama o próximo middleware ou rota
    next();
  } catch (error) {
    console.log("Erro ao verificar o token:", error); // Exibe o erro no console (para debug)

    // Retorna erro 401 se o token for inválido ou expirado
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
