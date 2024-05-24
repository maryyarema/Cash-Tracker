import { Model, Optional, DataTypes, Association } from "sequelize";
import sequelize from "../utils/sequelize";
import config from "config";
import { IncomeCategory } from "./IncomeCategory";

const { CASH, CARD }: Record<string, string> = config.get(
  "INCOMES_AND_EXPENSES.TYPES"
);

type IncomeType = "cash" | "card";

export interface IncomeAttributes {
  id: string;
  date: Date;
  userId: string;
  amount: number;
  type: IncomeType;
  categoryId: string;
  description: string;
}

export type IncomeCreationAttributes = Optional<
  IncomeAttributes,
  "id" | "description"
>;

export class Income
  extends Model<IncomeAttributes, IncomeCreationAttributes>
  implements IncomeAttributes
{
  public id!: string;
  public date: Date;
  public userId: string;
  public amount: number;
  public type: IncomeType;
  public categoryId: string;
  public description: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    category: Association<Income, IncomeCategory>;
  };
}

Income.init(
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
        model: "income_categories",
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
      },
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
    tableName: "incomes",
  }
);
