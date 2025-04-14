import { Request, Response } from "express";
import { Authenticator } from "../middlewares/authenticator";
import UserModel, { IBaseUser } from "../models/userModel";

const authenticator = new Authenticator();

export class LoginController {
  async login(req: Request, res: Response): Promise<void> {
    try {

        console.log("Body da requisição:", req.body);
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        res.status(400).send({ message: "Email e senha são obrigatórios." });
        return;
      }

      // Busca o usuário pelo e-mail usando método estático do model
      const user = await UserModel.findByEmail(email) as IBaseUser | null;

      if (!user) {
        res.status(404).send({ message: "Usuário não encontrado." });
        return;
      }

      // Verifica se a senha é válida
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        res.status(401).send({ message: "Senha incorreta." });
        return;
      }

      // Gera o token JWT
      const token = authenticator.generateToken({ id: user._id.toString() });

      // Retorna o token e dados relevantes (opcionalmente mais dados do usuário)
      res.status(200).send({
        message: "Login realizado com sucesso.",
        token,
        user: {
          id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error: any) {
      console.error("Erro no login:", error);
      res.status(500).send({ message: error.message || "Erro interno do servidor." });
    }
  }
}
