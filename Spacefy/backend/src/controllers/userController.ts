import { Request, Response } from "express";
import UserModel from "../models/userModel";
import mongoose from "mongoose";
import { hash } from "../middlewares/hashManager";
import FavoriteModel from "../models/favoriteModel";
import { IPopulatedFavorite } from "../types/favorite";
import "../models/spaceModel"; // Importando o modelo de espaço para o populate funcionar
import RentalModel from "../models/rentalModel";
import SpaceModel from "../models/spaceModel";
import { Authenticator } from "../middlewares/authenticator";
import redisConfig from "../config/redisConfig";

// Listar todos os usuários (com espaços alugados)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (req.auth?.role !== "admin") {
      res.status(403).json({
        error:
          "Acesso negado. Apenas administradores podem listar todos os usuários.",
      });
      return;
    }

    // Parâmetros de paginação
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Tenta obter os dados do cache
    const cacheKey = `all_users_page_${page}_limit_${limit}`;
    const cachedUsers = await redisConfig.getRedis(cacheKey);
    
    if (cachedUsers) {
      res.status(200).json(JSON.parse(cachedUsers));
      return;
    }

    // Busca o total de usuários para a paginação
    const totalUsers = await UserModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await UserModel.find({}, "-password")
      .skip(skip)
      .limit(limit);

    const usersWithRentals = await Promise.all(
      users.map(async (user) => {
        const rentals = await RentalModel.find({ user: user._id }).populate("space");
        return {
          ...user.toObject(),
          espacosAlugados: rentals.map((r) => r.space),
        };
      })
    );

    const response = {
      users: usersWithRentals,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        usersPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };

    await redisConfig.setRedis(cacheKey, JSON.stringify(response), 300);

    res.status(200).json(response);
    return;
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao listar usuários" });
    return;
  }
};

// Criar um novo usuário
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, surname, email, password, telephone, role, cpfOrCnpj } =
      req.body;

    if (!name || !surname || !email || !password || !telephone || !role) {
      res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
      return;
    }

    if (role === "locatario" && !cpfOrCnpj) {
      res.status(400).json({ error: "O campo CPF/CNPJ é obrigatório para locatários." });
      return;
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
    return;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if ((error as CustomError).code === 11000) {
      res.status(400).json({ error: "O e-mail já está em uso." });
      return;
    }
    res.status(500).json({ error: "Erro ao criar usuário" });
    return;
  }
};

// Atualizar um usuário
export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      res.status(401).json({ error: "Autenticação necessária" });
      return;
    }

    const { id } = req.params;
    const { name, email, telephone, password, surname, profilePhoto } = req.body;
    const { id: userId } = req.auth;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID de usuário inválido." });
      return;
    }

    // Verifica se o usuário que está fazendo a requisição é o próprio usuário
    if (userId !== id) {
      res.status(403).json({ error: "Você só pode atualizar seus próprios dados." });
      return;
    }

    // Verifica se pelo menos um campo foi fornecido
    if (!name && !email && !telephone && !password && !surname && !profilePhoto) {
      res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização." });
      return;
    }

    // Cria um objeto com apenas os campos fornecidos
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (telephone) updateData.telephone = telephone;
    if (surname) updateData.surname = surname;
    if (password) updateData.password = await hash(password);
    if (profilePhoto) updateData.profilePhoto = profilePhoto;

    // Verifica se o email já existe apenas se um novo email foi fornecido
    if (email) {
      const emailExists = await UserModel.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        res.status(409).json({ error: "Este e-mail já está em uso por outro usuário." });
        return;
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    // Invalida os caches relacionados ao usuário
    await Promise.all([
      redisConfig.deleteRedis(`user_${id}`),
      redisConfig.deleteRedis(`user_favorites_${id}`),
      redisConfig.deleteRedis(`user_rentals_${id}`),
      // Invalida o cache de todos os usuários pois a lista pode ter mudado
      redisConfig.deleteRedisPattern('all_users_page_*')
    ]);

    // Gera um novo token com os dados atualizados
    const authenticator = new Authenticator();
    const token = authenticator.generateToken({
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      telephone: updatedUser.telephone,
      role: updatedUser.role,
    });

    // Atualiza o token no cookie
    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    res.status(200).json({
      message: "Usuário atualizado com sucesso.",
      user: updatedUser,
      token
    });
    return;
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    if (error.code === 11000) {
      res.status(409).json({ error: "E-mail já cadastrado." });
      return;
    }
    res.status(500).json({ error: "Erro ao atualizar usuário." });
    return;
  }
};

// Atualizar usuário para locatário
export const updateToLocatario = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      res.status(401).json({ error: "Autenticação necessária" });
      return;
    }

    const { id } = req.params;
    const { cpfOrCnpj } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID de usuário inválido." });
      return;
    }

    if (!cpfOrCnpj) {
      res.status(400).json({ error: "O campo CPF/CNPJ é obrigatório para locatários." });
      return;
    }

    // Verifica se o usuário que está fazendo a requisição é o próprio usuário ou um admin
    if (req.auth.id !== id && req.auth.role !== "admin") {
      res.status(403).json({ error: "Você não tem permissão para realizar esta ação." });
      return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { 
        role: "locatario",
        cpfOrCnpj 
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    // Invalida os caches relacionados ao usuário
    await Promise.all([
      redisConfig.deleteRedis(`user_${id}`),
      redisConfig.deleteRedis(`user_favorites_${id}`),
      redisConfig.deleteRedis(`user_rentals_${id}`),
      // Invalida o cache de todos os usuários pois a lista pode ter mudado
      redisConfig.deleteRedisPattern('all_users_page_*')
    ]);

    // Gera um novo token com os dados atualizados
    const authenticator = new Authenticator();
    const token = authenticator.generateToken({
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      telephone: updatedUser.telephone,
      role: updatedUser.role,
    });

    // Atualiza o token no cookie
    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    res.status(200).json({
      message: "Usuário atualizado para locatário com sucesso.",
      user: updatedUser,
      token
    });
    return;
  } catch (error) {
    console.error("Erro ao atualizar usuário para locatário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário para locatário." });
    return;
  }
};

// Favoritar ou desfavoritar um espaço
export const toggleFavoriteSpace = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { spaceId } = req.body;

  try {
    if (!req.auth) {
      res.status(401).json({
        error: "Autenticação necessária para favoritar espaços.",
      });
      return;
    }

    if (!spaceId) {
      res.status(400).json({ error: "O ID do espaço é obrigatório." });
      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(spaceId)
    ) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    const existingFavorite = await FavoriteModel.findOne({ userId, spaceId });

    if (existingFavorite) {
      // Remove o favorito
      await FavoriteModel.deleteOne({ userId, spaceId });
      // Invalida o cache de favoritos do usuário
      await redisConfig.deleteRedis(`user_favorites_${userId}`);
      res.status(200).json({
        message: "Espaço removido dos favoritos.",
        isFavorited: false
      });
      return;
    } else {
      // Adiciona o favorito
      await FavoriteModel.create({ userId, spaceId });
      // Invalida o cache de favoritos do usuário
      await redisConfig.deleteRedis(`user_favorites_${userId}`);
      res.status(200).json({
        message: "Espaço adicionado aos favoritos.",
        isFavorited: true
      });
      return;
    }
  } catch (error) {
    console.error("Erro ao favoritar/desfavoritar espaço:", error);
    res.status(500).json({ error: "Erro interno ao atualizar favoritos." });
    return;
  }
};

export const getUserFavorites = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    if (!req.auth) {
      res.status(401).json({
        error: "Autenticação necessária para ver favoritos.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }

    // Tenta obter os dados do cache
    const cacheKey = `user_favorites_${userId}`;
    const cachedFavorites = await redisConfig.getRedis(cacheKey);
    
    if (cachedFavorites) {
      res.status(200).json(JSON.parse(cachedFavorites));
      return;
    }

    const favorites = await FavoriteModel.find({ userId })
      .populate<{ spaceId: IPopulatedFavorite['spaceId'] }>("spaceId", "space_name image_url price_per_hour location")
      .sort({ createdAt: -1 });

    await redisConfig.setRedis(cacheKey, JSON.stringify(favorites), 300);

    res.status(200).json(favorites);
    return;
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    res.status(500).json({ error: "Erro interno ao buscar favoritos." });
    return;
  }
};

// Deletar um usuário
export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      res.status(401).json({ error: "Autenticação necessária" });
      return;
    }

    const { id } = req.params;
    const { role, id: userId } = req.auth;

    const allowedRoles = ["usuario", "locatario", "admin"];

    if (!allowedRoles.includes(role)) {
      res.status(403).json({
        error:
          "Apenas usuários, locatários ou administradores podem deletar contas",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    if (role !== "admin" && userId !== id) {
      res.status(403).json({
        error: "Você só pode deletar sua própria conta",
      });
      return;
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    // Invalida todos os caches relacionados ao usuário
    await Promise.all([
      redisConfig.deleteRedis(`user_${id}`),
      redisConfig.deleteRedis(`user_favorites_${id}`),
      redisConfig.deleteRedis(`user_rentals_${id}`),
      // Invalida o cache de todos os usuários pois a lista mudou
      redisConfig.deleteRedisPattern('all_users_page_*')
    ]);

    res.status(200).json({ message: "Conta deletada com sucesso" });
    return;
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({
      error: "Erro interno no servidor ao deletar usuário",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    });
    return;
  }
};

// Obter espaços alugados por um usuário
export const getUserRentals = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      res.status(401).json({ error: "Autenticação necessária" });
      return;
    }

    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "ID de usuário inválido." });
      return;
    }

    // Verifica se o usuário que está fazendo a requisição é o próprio usuário ou um admin
    if (req.auth.id !== userId && req.auth.role !== "admin") {
      res.status(403).json({ error: "Você não tem permissão para ver os aluguéis deste usuário." });
      return;
    }

    // Tenta obter os dados do cache
    const cacheKey = `user_rentals_${userId}`;
    const cachedRentals = await redisConfig.getRedis(cacheKey);
    
    if (cachedRentals) {
      res.status(200).json(JSON.parse(cachedRentals));
      return;
    }

    // Busca todos os aluguéis do usuário
    const rentals = await RentalModel.find({ user: userId })
      .populate("space", "space_name location price_per_hour max_people image_url")
      .sort({ createdAt: -1 });

    // Agrupa os aluguéis por espaço e mantém apenas o mais recente
    const uniqueRentals = rentals.reduce((acc: any[], rental) => {
      const spaceId = rental.space._id.toString();
      const existingRental = acc.find(r => r.space._id.toString() === spaceId);
      
      if (!existingRental) {
        acc.push(rental);
      }
      return acc;
    }, []);

    await redisConfig.setRedis(cacheKey, JSON.stringify(uniqueRentals), 300);

    res.status(200).json(uniqueRentals);
    return;
  } catch (error) {
    console.error("Erro ao buscar aluguéis do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar aluguéis do usuário" });
    return;
  }
};

// Obter usuário por ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID de usuário inválido." });
      return;
    }

    // Tenta obter os dados do cache
    const cacheKey = `user_${id}`;
    const cachedUser = await redisConfig.getRedis(cacheKey);
    
    if (cachedUser) {
      res.status(200).json(JSON.parse(cachedUser));
      return;
    }

    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    await redisConfig.setRedis(cacheKey, JSON.stringify(user), 300);

    res.status(200).json(user);
    return;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
    return;
  }
};

interface CustomError extends Error {
  code?: number;
}
