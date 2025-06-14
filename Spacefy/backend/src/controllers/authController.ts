import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { compare } from "../middlewares/hashManager";
import { Authenticator } from "../middlewares/authenticator";
import { IBaseUser } from "../types/user"; // ajuste o caminho se necessário
import connectDB from "../config/database";
import mongoose from "mongoose";

const authenticator = new Authenticator();

export const login = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Preencha todos os campos" });
      return
    }

    const user = (await UserModel.findOne({ email })) as IBaseUser;

    if (!user) {
      res.status(401).json({ error: "E-mail ou senha inválidos" });
      return
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: "E-mail ou senha inválidos" });
      return
    }

    const token = authenticator.generateToken({
      id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      profilePhoto: user.profilePhoto || undefined,
    });

    // Armazena o token no cookie
    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
      sameSite: "strict", // Protege contra CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
      },
    });
    return
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

// Ler um cookie
export const getCookie = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    const token = req.cookies.token; // Acessa o cookie "token"
    if (!token) {
      res.status(404).json({ message: "Cookie não encontrado" });
      return
    }
    res.status(200).json({ token });
    return
  } catch (error) {
    console.error("Erro ao obter cookie:", error);
    res.status(500).json({ error: "Erro ao obter cookie" });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};

// Excluir um cookie
export const deleteCookie = async (req: Request, res: Response) => {
  try {
    await connectDB(); // conecta ao banco
    res.clearCookie("token");
    res.status(200).json({ message: "Cookie removido com sucesso!" });
    return
  } catch (error) {
    console.error("Erro ao deletar cookie:", error);
    res.status(500).json({ error: "Erro ao deletar cookie" });
  } finally {
    mongoose.disconnect().catch(err => {
      console.error("Erro ao desconectar do MongoDB:", err);
    });
  }
};
