import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { compare } from "../middlewares/hashManager";
import { Authenticator } from "../middlewares/authenticator";
import { IBaseUser } from "../types/user"; // ajuste o caminho se necessário

const authenticator = new Authenticator();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" }); // Adicionando o return aqui
    }

    const user = (await UserModel.findOne({ email })) as IBaseUser;

    if (!user) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" }); // Adicionando o return aqui
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" }); // Adicionando o return aqui
    }

    const token = authenticator.generateToken({
      id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
    });

    // Armazena o token no cookie
    res.cookie("token", token, {
      httpOnly: true, // Impede acesso ao cookie via JavaScript no navegador
      secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
      sameSite: "strict", // Protege contra CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
      },
    }); // Adicionando o return aqui
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ error: "Erro ao fazer login" }); // Adicionando o return aqui
  }
};

// Ler um cookie
export const getCookie = (req: Request, res: Response) => {
  const token = req.cookies.token; // Acessa o cookie "token"
  if (!token) {
    return res.status(404).json({ message: "Cookie não encontrado" });
  }
  res.status(200).json({ token });
};

// Excluir um cookie
export const deleteCookie = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Cookie removido com sucesso!" });
};
