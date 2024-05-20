import { Model, Optional, DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

interface ExpenseCategoryAttributes {
  id: string;
  name: string;
  userId: string;
}

type ExpenseCategoryCreationAttributes = Optional<
  ExpenseCategoryAttributes,
  "id"
>;

export class ExpenseCategory
  extends Model<ExpenseCategoryAttributes, ExpenseCategoryCreationAttributes>
  implements ExpenseCategoryAttributes
{
  public id!: string;
  public name: string;
  public userId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExpenseCategory.init(
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
      unique: "expense_categories_name_user_id_unique_key",
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
      unique: "expense_categories_name_user_id_unique_key",
    },
  },
  {
    sequelize,
    underscored: true,
    tableName: "expense_categories",
  }
);
