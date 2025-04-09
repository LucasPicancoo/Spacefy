// Importa o Mongoose para trabalhar com MongoDB e definir tipos e esquemas
import mongoose, { Schema, Document } from "mongoose";
// Importa o bcrypt para criptografar senhas
import bcrypt from "bcryptjs";

// Define a interface base para os atributos comuns de todos os usuários
export interface IBaseUser extends Document {
  name: string; // Nome do usuário
  surname: string; // Sobrenome do usuário
  email: string; // E-mail do usuário
  password: string; // Senha do usuário
  telephone: string; // Telefone do usuário
  role: "locatario" | "usuario"; // Papel do usuário: locatário ou usuário comum
}

// Interface para o usuário comum (herda os atributos da interface base)
export interface User extends IBaseUser {}

// Interface para o locatário (herda os atributos da interface base e adiciona CPF/CNPJ)
export interface Tenant extends IBaseUser {
  cpfOrCnpj: string; // CPF ou CNPJ do locatário
}

// Define o esquema do usuário no MongoDB, incluindo validações e atributos específicos para cada tipo de usuário
const UserSchema: Schema = new Schema({
  name: { type: String, required: true }, // Nome do usuário
  surname: { type: String, required: true }, // Sobrenome do usuário
  email: { type: String, required: true, unique: true }, // E-mail único
  password: { type: String, required: true }, // Senha
  telephone: { type: String, required: true }, // Telefone
  role: {
    // Papel do usuário (locatário ou usuário comum)
    type: String,
    enum: ["locatario", "usuario"],
    required: true,
  },
  cpfOrCnpj: {
    // CPF ou CNPJ (apenas para locatários)
    type: String,
    required: function (this: any) {
      return this.role === "locatario"; // CPF/CNPJ é obrigatório apenas para locatários
    },
  },
});

// Middleware que é executado antes de salvar o documento no banco de dados
UserSchema.pre<IBaseUser>("save", async function (this: any, next) {
  // Verifica se o campo "password" foi modificado
  if (this.isModified("password")) {
    // Criptografa a senha antes de salvar no banco de dados
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Valida CPF/CNPJ para locatários
  if (this.role === "locatario" && this.cpfOrCnpj) {
    if (this.cpfOrCnpj.length !== 11 && this.cpfOrCnpj.length !== 14) {
      throw new Error("O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos.");
    }
  }

  next();
});

// Exporta o modelo "user" baseado no esquema UserSchema
// O modelo será usado para interagir com a coleção "user" no MongoDB
export default mongoose.model<IBaseUser>("user", UserSchema, "user");