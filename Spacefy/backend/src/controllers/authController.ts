import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { compare, hash } from "../middlewares/hashManager";
import { Authenticator } from "../middlewares/authenticator";
import { IBaseUser } from "../types/user"; // ajuste o caminho se necessário
import { v4 as uuidv4 } from "uuid";

const authenticator = new Authenticator();

// Simulação de envio de e-mail (substituir depois pelo Nodemailer, se quiser)
async function sendRecoveryEmail(email: string, token: string) {
  console.log(`Enviar email para ${email} com token: ${token}`);
}

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

    const token = authenticator.generateToken({
      id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      telephone: user.telephone,
      role: user.role
    });

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

// -----------------------------
// Recuperação de senha
// -----------------------------

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Preencha o campo de e-mail" });
    }

    const user = await UserModel.findOne({ email }) as IBaseUser;

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hora de validade

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    await sendRecoveryEmail(user.email, token);

    res.status(200).json({ message: "Token de recuperação enviado para o e-mail cadastrado." });
  } catch (error) {
    console.error("Erro ao solicitar recuperação de senha:", error);
    res.status(500).json({ error: "Erro ao solicitar recuperação de senha" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    }) as IBaseUser;

    if (!user) {
      return res.status(400).json({ error: "Token inválido ou expirado" });
    }

    user.password = await hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ error: "Erro ao redefinir senha" });
  }
};
