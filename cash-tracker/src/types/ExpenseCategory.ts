import { ExpenseCategory } from "../models/ExpenseCategory";

export interface CreateExpenseCategoryRequest {
    name: string;
    userId: string;
}

export type CreateExpenseCategoryResponse = Pick<ExpenseCategory, "id" | "name">;
