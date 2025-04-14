import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

// Interface base para o documento
export interface IBaseUser extends Document {
  _id: Types.ObjectId;
  name: string;
  surname: string;
  email: string;
  password: string;
  telephone: string;
  role: "locatario" | "usuario";
  cpfOrCnpj?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface dos métodos estáticos
interface IUserModel extends Model<IBaseUser> {
  findByEmail(email: string): Promise<IBaseUser | null>;
}

// Schema do usuário
const UserSchema = new Schema<IBaseUser>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  role: {
    type: String,
    enum: ["locatario", "usuario"],
    required: true,
  },
  cpfOrCnpj: {
    type: String,
    required: function (this: any) {
      return this.role === "locatario";
    },
  },
});

// Método de instância para comparar senhas
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método estático para buscar usuário por email
UserSchema.statics.findByEmail = async function (
  email: string
): Promise<IBaseUser | null> {
  return this.findOne({ email });
};

// Middleware para hash da senha e validação de CPF/CNPJ
UserSchema.pre<IBaseUser>("save", async function (this: any, next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.role === "locatario" && this.cpfOrCnpj) {
    if (this.cpfOrCnpj.length !== 11 && this.cpfOrCnpj.length !== 14) {
      throw new Error("O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos.");
    }
  }

  next();
});

// Exporta o model com métodos estáticos e de instância tipados corretamente
export default mongoose.model<IBaseUser, IUserModel>("user", UserSchema, "user");

