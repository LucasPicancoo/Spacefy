import { Request, Response } from "express";
import UserModel from "../models/userModel";

// Listar todos os usuários
export const getAllUsers = async (req: Request, res: Response) => {
  try {
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
    const { name, surname, email, password, telephone, role, cpfOrCnpj } = req.body;

    // Verifica se todos os campos obrigatórios foram enviados
    if (!name || !surname || !email || !password || !telephone || !role) {
      res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Verifica se o campo CPF/CNPJ está vazio para locatários
    if (role === "locatario" && !cpfOrCnpj) {
      res.status(400).json({ error: "O campo CPF/CNPJ é obrigatório para locatários." });
    }

    // Cria um novo usuário com os dados enviados
    const newUser = new UserModel({ name, surname, email, password, telephone, role, cpfOrCnpj });
    await newUser.save();

    // Remove a senha da resposta
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    // Verifica se o erro é de duplicidade de e-mail
    if (error instanceof Error && error.code === 11000) {
      res.status(400).json({ error: "O e-mail já está em uso." });
    }

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      return res.status(400).json({ error: "A senha não pode ser atualizada por aqui." });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};

