// config/database.ts - Configuração do banco de dados
import { Sequelize } from "sequelize";
const sequelize = new Sequelize(
  "postgres://user:password@localhost:5432/meubanco"
); // Substituir pelos dados corretos do banco

export default sequelize;
