import { Request, Response } from "express";
import UserModel from "../models/userModel";
import mongoose from "mongoose";
import { hash } from "../middlewares/hashManager";
// Deixando aqui algumas importações caso necessário
// import { ObjectId } from "mongoose";
// import { IBaseUser } from "../types/user";
// import { User } from "../types/user";
// import mongoose, { Schema, model } from "mongoose";

// Listar todos os usuários
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Verifica se o usuário é admin
    if (req.auth?.role !== "admin") {
      return res.status(403).json({
        error:
          "Acesso negado. Apenas administradores podem listar todos os usuários.",
      });
    }

    const users = await UserModel.find({}, "-password"); // Exclui o campo "password" da resposta
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

// Criar um novo usuário
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, surname, email, password, telephone, role, cpfOrCnpj } =
      req.body;

    // Verifica se todos os campos obrigatórios foram enviados
    if (!name || !surname || !email || !password || !telephone || !role) {
      res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Verifica se o campo CPF/CNPJ está vazio para locatários
    if (role === "locatario" && !cpfOrCnpj) {
      res
        .status(400)
        .json({ error: "O campo CPF/CNPJ é obrigatório para locatários." });
    }

    // Cria um novo usuário com os dados enviados
    const newUser = new UserModel({
      name,
      surname,
      email,
      password,
      telephone,
      role,
      cpfOrCnpj,
    });
    await newUser.save();

    // Remove a senha da resposta
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    // Verifica se o erro é de duplicidade de e-mail (erro do MongoDB)
    if ((error as CustomError).code === 11000) {
      res.status(400).json({ error: "O e-mail já está em uso." });
    } else {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, telephone, password, surname } = req.body;

    // Validação de ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de usuário inválido." });
    }

    // Verificação de campos obrigatórios
    if (!name || !email || !telephone || !password || !surname) {
      return res
        .status(400)
        .json({ error: "Preencha todos os campos obrigatórios." });
    }

    // Verificar se o e-mail já existe em outro usuário
    const emailExists = await UserModel.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      return res
        .status(409)
        .json({ error: "Este e-mail já está em uso por outro usuário." });
    }

    // Criptografa a senha antes de atualizar
    const hashedPassword = await hash(password);

    // Atualização
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { name, email, telephone, password: hashedPassword, surname },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);

    // Tratamento específico para erro de chave duplicada (caso escape da verificação manual)
    if (error.code === 11000) {
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    return res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

export const toggleFavoriteSpace = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { spaceId } = req.body;

  try {
    // 1. Verifica se o usuário tem permissão
    if (req.auth?.role !== "usuario") {
      return res.status(403).json({
        error: "Apenas usuários podem favoritar ou desfavoritar espaços.",
      });
    }

    // 2. Verifica se spaceId foi enviado
    if (!spaceId) {
      return res.status(400).json({ error: "O ID do espaço é obrigatório." });
    }

    // 3. Verifica se userId e spaceId são ObjectIds válidos
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(spaceId)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    // 4. Encontra o usuário
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    // 5. Verifica se o espaço já está nos favoritos
    const alreadyFavorited = (user.favorites ?? []).some(
      (id) => id.toString() === spaceId
    );

    // 6. Adiciona ou remove dos favoritos
    if (alreadyFavorited) {
      user.favorites = (user.favorites ?? []).filter(
        (id) => id.toString() !== spaceId
      );
    } else {
      user.favorites = [...(user.favorites ?? []), (spaceId)];
    }

    await user.save();

    return res.status(200).json({
      message: alreadyFavorited
        ? "Espaço removido dos favoritos."
        : "Espaço adicionado aos favoritos.",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Erro ao favoritar/desfavoritar espaço:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar favoritos." });
  }
};
// Deletar um usuário
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Verificação mais robusta da autenticação e autorização
    if (!req.auth) {
      return res.status(401).json({ error: "Autenticação necessária" });
    }

    const { id } = req.params;
    const { role, id: userId } = req.auth;

    // Lista de roles permitidas para deletar contas
    const allowedRoles = ["usuario", "locatario", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: "Apenas usuários, locatários ou administradores podem deletar contas"
      });
    }

    // Validação do ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Verificação de propriedade da conta
    if (role !== "admin" && userId !== id) {
      return res.status(403).json({
        error: "Você só pode deletar sua própria conta"
      });
    }

    // Operação de deleção
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({ message: "Conta deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({
      error: "Erro interno no servidor ao deletar usuário",
      details: error.message
    });
  }
};

interface CustomError extends Error {
  code?: number;
}
