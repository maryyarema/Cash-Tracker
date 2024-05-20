import { Model, Optional, DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";
import config from "config";

const { CASH, CARD }: Record<string, string> = config.get("INCOME_EXPENSE_TYPES");

type ExpenseType = "cash" | "card";

interface ExpenseAttributes {
  id: string;
  date: Date;
  userId: string;
  amount: number;
  type: ExpenseType;
  categoryId: string;
  description: string;
}

export type ExpenseCreationAttributes = Optional<
  ExpenseAttributes,
  "id" | "description"
>;

export class Expense
  extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes
{
  public id!: string;
  public date: Date;
  public userId: string;
  public amount: number;
  public type: ExpenseType;
  public categoryId: string;
  public description: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Expense.init(
  {
    id: {
      field: "id",
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    },
    categoryId: {
      field: "category_id",
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        key: "id",
        model: "expense_categories",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    },
    date: {
      field: "date",
      allowNull: false,
      type: DataTypes.DATE,
    },
    amount: {
      field: "amount",
      allowNull: false,
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("amount");
        return Number(value);
      }
    },
    type: {
      field: "type",
      allowNull: false,
      type: DataTypes.ENUM(CASH, CARD),
    },
    description: {
      allowNull: true,
      field: "description",
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    tableName: "expenses",
  }
);
