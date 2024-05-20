import { Model, Optional, DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

interface UserAttributes {
  id: string;
  name: string;
  salt: string;
  email: string;
  password: string;
  passwordHash: Buffer;
}

type AutomationCreationAttributes = Optional<UserAttributes, "id" | "password">;

export class User
  extends Model<UserAttributes, AutomationCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name: string;
  public salt: string;
  public email: string;
  public password: string;
  public passwordHash: Buffer;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      field: "id",
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      unique: true,
      field: "email",
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Must be a valid email",
        },
      },
    },
    name: {
      field: "name",
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      field: "password",
      type: DataTypes.VIRTUAL,
    },
    salt: {
      allowNull: false,
      field: "salt",
      type: DataTypes.STRING,
    },
    passwordHash: {
      allowNull: false,
      field: "password_hash",
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    tableName: "users",
    hooks: {
      beforeValidate: (user: User) => {
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
      },
    },
  }
);
