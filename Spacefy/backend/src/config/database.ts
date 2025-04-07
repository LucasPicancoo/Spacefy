import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/meubanco";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Banco de dados MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
