// Importa o Mongoose para trabalhar com MongoDB e definir tipos e esquemas
import mongoose, { Schema, Document } from "mongoose";
// Importa o bcrypt para criptografar senhas
import bcrypt from "bcryptjs";

// Define a interface para os atributos de um usuário
export interface IUser extends Document {
  name: string; // Nome do usuário
  surname: string; // Sobrenome do usuário
  email: string; // E-mail do usuário
  password: string; // Senha do usuário
  telephone: string; // Telefone do usuário
  role: "locatario" | "usuario"; // Papel do usuário: locatário ou usuário comum
  cpfOrCnpj?: string; // CPF ou CNPJ (opcional, obrigatório apenas para locatários)
}

// Define o esquema do usuário no MongoDB
const UserSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  }, // Nome do usuário (obrigatório)

  surname: { 
    type: String, 
    required: true 
  }, // Sobrenome do usuário (obrigatório)

  email: { 
    type: String, 
    required: true, 
    unique: true 
  }, // E-mail único (obrigatório)

  password: { 
    type: String, 
    required: true 
  }, // Senha (obrigatória)

  telephone: { 
    type: String, 
    required: true 
  }, // Telefone (obrigatório)

  role: {
    type: String,
    enum: ["locatario", "usuario"],
    required: true,
  }, // Papel do usuário (obrigatório)

  cpfOrCnpj: {
    type: String,
    required: function (this: any) {
      return this.role === "locatario"; // CPF/CNPJ é obrigatório apenas para locatários
    },
    validate: {
      validator: function (value: string) {
        if (!value) return true; // Não valida se o campo não for obrigatório
        return value.length === 11 || value.length === 14; // CPF: 11 dígitos, CNPJ: 14 dígitos
      },
      message: "O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos.",
    },
  }, // CPF ou CNPJ (obrigatório apenas para locatários)
});

// Middleware que é executado antes de salvar o documento no banco de dados
UserSchema.pre<IUser>("save", async function (next) {
  // Verifica se o campo "password" foi modificado
  if (this.isModified("password")) {
    // Criptografa a senha antes de salvar no banco de dados
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// Exporta o modelo "User" baseado no esquema UserSchema
export default mongoose.model<IUser>("User", UserSchema);