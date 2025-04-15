import { Document, ObjectId } from "mongoose";

export interface IBaseUser extends Document {
  _id: ObjectId;
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