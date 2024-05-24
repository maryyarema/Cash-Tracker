import { ExpenseCategory } from "../models/ExpenseCategory";

export interface CreateExpenseCategoryRequest {
  name: string;
  userId: string;
}

export interface UpdateExpenseCategoryRequest
  extends CreateExpenseCategoryRequest {
  id: string;
}

export type CreateExpenseCategoryResponse = Pick<ExpenseCategory, "id" | "name">;

export type UpdateExpenseCategoryResponse = Pick<ExpenseCategory, "id" | "name">;

export interface AmountList {
  id: string;
  name: string;
  amount: number;
}

export interface ExpenseListByCategory {
  userId: string;
  categoryId: string;
}