import { Document } from "mongoose";
import mongoose from "mongoose";

// Interface base para usuários, representando os campos comuns a todos os tipos de usuários
export interface IBaseUser extends Document {
  _id: mongoose.Types.ObjectId; // ID único do usuário
  name: string; // Nome do usuário
  surname: string; // Sobrenome do usuário
  email: string; // E-mail do usuário
  password: string; // Senha do usuário
  telephone: string; // Telefone do usuário
  role: "locatario" | "usuario" | "admin"; // Papel do usuário (locatário, usuário comum ou administrador)
  favorites?: mongoose.Types.ObjectId[]; // Lista de IDs dos espaços favoritados
  profilePhoto?: string | null; // URL da foto de perfil do usuário
}

// Interface para locatários, que herdam os campos da interface base e adicionam o CPF ou CNPJ
export interface Tenant extends IBaseUser {
  cpfOrCnpj: string; // CPF ou CNPJ do locatário
}

// Interface para usuários (sem alterações adicionais)
export interface User extends IBaseUser { }