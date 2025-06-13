import mongoose, { Schema, model } from "mongoose";
import { IBaseUser } from "../types/user";
import { hash } from "../middlewares/hashManager";
import { User } from "../types/user";

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  role: {
    type: String,
    enum: ["locatario", "usuario", "admin"],
    required: true,
  },
  cpfOrCnpj: {
    type: String,
    required: function (this: any) {
      return this.role === "locatario";
    },
  },
  profilePhoto: {
    type: String,
    required: false,
    default: null
  }
});

UserSchema.pre<IBaseUser>("save", async function (this: any, next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password);
  }

  if (this.role === "locatario" && this.cpfOrCnpj) {
    if (this.cpfOrCnpj.length !== 11 && this.cpfOrCnpj.length !== 14) {
      throw new Error(
        "O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos."
      );
    }
  }

  next();
});

export default mongoose.model<IBaseUser>("user", UserSchema, "user");
export const UserModel = model<User>("User", UserSchema);
