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
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const user = await UserModel.findOne({ email }) as IBaseUser;

    if (!user) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" });
    }

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({ id: user._id.toString() });

    res.status(200).json({
      message: "Login realizado com sucesso", 
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
