// Importa o Mongoose para gerenciar a conexão com o MongoDB
import mongoose from "mongoose";
// Importa o dotenv para carregar variáveis de ambiente do arquivo .env
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Define a URI de conexão com o MongoDB, utilizando a variável de ambiente MONGO_URI ou um valor padrão
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/meubanco";

// Função assíncrona para conectar ao banco de dados MongoDB
const connectDB = async () => {
  try {
    // Tenta conectar ao MongoDB usando a URI definida
    await mongoose.connect(MONGO_URI);
    console.log("Banco de dados MongoDB conectado com sucesso!"); // Mensagem de sucesso
  } catch (error) {
    // Exibe uma mensagem de erro caso a conexão falhe
    console.error("Erro ao conectar ao banco de dados MongoDB:", error);
    process.exit(1); // Encerra o processo com código de erro
  }
};

// Exporta a função de conexão para ser usada em outras partes do projeto
export default connectDB;