import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import db from "../config/database";

// Interface para os atributos do usuário
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: "locatario" | "usuario";
}

// Interface para criação de um novo usuário (id é opcional)
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Definição do modelo User
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: "locatario" | "usuario";
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("locatario", "usuario"),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "User",
  }
);

// Antes de salvar um novo usuário, faz o hash da senha
User.beforeCreate(async (user: User) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

export default User;
