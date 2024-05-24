import { Model, Optional, DataTypes, Association } from "sequelize";
import sequelize from "../utils/sequelize";
import { Income } from "./Income";

interface IncomeCategoryAttributes {
  id: string;
  name: string;
  userId: string;
}

type IncomeCategoryCreationAttributes = Optional<
  IncomeCategoryAttributes,
  "id"
>;

export class IncomeCategory
  extends Model<IncomeCategoryAttributes, IncomeCategoryCreationAttributes>
  implements IncomeCategoryAttributes
{
  public id!: string;
  public name: string;
  public userId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    incomes: Association<IncomeCategory, Income>;
  };
}

IncomeCategory.init(
  {
    id: {
      field: "id",
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      field: "name",
      allowNull: false,
      type: DataTypes.STRING,
      unique: "income_categories_name_user_id_unique_key",
    },
    userId: {
      field: "user_id",
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        key: "id",
        model: "users",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
      unique: "income_categories_name_user_id_unique_key",
    },
  },
  {
    sequelize,
    underscored: true,
    tableName: "income_categories",
  }
);
