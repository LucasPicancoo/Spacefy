import { Request, Response } from "express";
import UserModel from "../models/userModel";
import mongoose from "mongoose";
import { hash } from "../middlewares/hashManager";
import RentalModel from "../models/rentalModel";
import SpaceModel from "../models/spaceModel";

// Listar todos os usuários (com espaços alugados)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (req.auth?.role !== "admin") {
      return res.status(403).json({
        error:
          "Acesso negado. Apenas administradores podem listar todos os usuários.",
      });
    }

    const users = await UserModel.find({}, "-password");

    const usersWithRentals = await Promise.all(
      users.map(async (user) => {
        const rentals = await RentalModel.find({ user: user._id }).populate("space");
        return {
          ...user.toObject(),
          espacosAlugados: rentals.map((r) => r.space),
        };
      })
    );

    res.status(200).json(usersWithRentals);
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

    if (!name || !surname || !email || !password || !telephone || !role) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    if (role === "locatario" && !cpfOrCnpj) {
      return res
        .status(400)
        .json({ error: "O campo CPF/CNPJ é obrigatório para locatários." });
    }

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

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if ((error as CustomError).code === 11000) {
      return res.status(400).json({ error: "O e-mail já está em uso." });
    }
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

// Atualizar um usuário
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, telephone, password, surname } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de usuário inválido." });
    }

    if (!name || !email || !telephone || !password || !surname) {
      return res
        .status(400)
        .json({ error: "Preencha todos os campos obrigatórios." });
    }

    const emailExists = await UserModel.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      return res
        .status(409)
        .json({ error: "Este e-mail já está em uso por outro usuário." });
    }

    const hashedPassword = await hash(password);

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
    if (error.code === 11000) {
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }
    return res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

// Favoritar ou desfavoritar um espaço
export const toggleFavoriteSpace = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { spaceId } = req.body;

  try {
    if (req.auth?.role !== "usuario") {
      return res.status(403).json({
        error: "Apenas usuários podem favoritar ou desfavoritar espaços.",
      });
    }

    if (!spaceId) {
      return res.status(400).json({ error: "O ID do espaço é obrigatório." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(spaceId)
    ) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const alreadyFavorited = (user.favorites ?? []).some(
      (id) => id.toString() === spaceId
    );

    if (alreadyFavorited) {
      user.favorites = (user.favorites ?? []).filter(
        (id) => id.toString() !== spaceId
      );
    } else {
      user.favorites = [...(user.favorites ?? []), spaceId];
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
    return res
      .status(500)
      .json({ error: "Erro interno ao atualizar favoritos." });
  }
};

// Deletar um usuário
export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: "Autenticação necessária" });
    }

    const { id } = req.params;
    const { role, id: userId } = req.auth;

    const allowedRoles = ["usuario", "locatario", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error:
          "Apenas usuários, locatários ou administradores podem deletar contas",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (role !== "admin" && userId !== id) {
      return res.status(403).json({
        error: "Você só pode deletar sua própria conta",
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({ message: "Conta deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({
      error: "Erro interno no servidor ao deletar usuário",
      details: error.message,
    });
  }
};

interface CustomError extends Error {
  code?: number;
}
