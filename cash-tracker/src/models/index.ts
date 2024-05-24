import { Expense } from "./Expense";
import { ExpenseCategory } from "./ExpenseCategory";
import { Income } from "./Income";
import { IncomeCategory } from "./IncomeCategory";

ExpenseCategory.hasMany(Expense, {
  sourceKey: "id",
  foreignKey: "categoryId",
  as: "expenses",
});
Expense.belongsTo(ExpenseCategory, {
  as: "category",
  foreignKey: "categoryId",
});

IncomeCategory.hasMany(Income, {
  sourceKey: "id",
  foreignKey: "categoryId",
  as: "incomes",
});
Income.belongsTo(IncomeCategory, {
  as: "category",
  foreignKey: "categoryId",
});

export { Expense } from "./Expense";
export { ExpenseCategory } from "./ExpenseCategory";
export { Income } from "./Income";
export { IncomeCategory } from "./IncomeCategory";
