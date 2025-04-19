// Importa os tipos Document e ObjectId do Mongoose para definir a estrutura dos documentos no banco de dados
import { Document, ObjectId } from "mongoose";

// Interface base para usuários, representando os campos comuns a todos os tipos de usuários
export interface IBaseUser extends Document {
  _id: ObjectId; // ID único do usuário
  name: string; // Nome do usuário
  surname: string; // Sobrenome do usuário
  email: string; // E-mail do usuário
  password: string; // Senha do usuário
  telephone: string; // Telefone do usuário
  role: "locatario" | "usuario"; // Papel do usuário: locatário ou usuário comum
}

// Interface para usuários comuns, que herdam os campos da interface base
export interface User extends IBaseUser {}

// Interface para locatários, que herdam os campos da interface base e adicionam o CPF ou CNPJ
export interface Tenant extends IBaseUser {
  cpfOrCnpj: string; // CPF ou CNPJ do locatário
}