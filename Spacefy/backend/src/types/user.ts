import { Document } from "mongoose";

export interface IBaseUser extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  telephone: string;
  role: "locatario" | "usuario";
}

export interface User extends IBaseUser {}

export interface Tenant extends IBaseUser {
  cpfOrCnpj: string;
}