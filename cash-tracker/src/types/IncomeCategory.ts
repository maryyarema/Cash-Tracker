import { IncomeCategory } from "../models/IncomeCategory";

export interface CreateIncomeCategoryRequest {
  name: string;
  userId: string;
}

export interface UpdateIncomeCategoryRequest
  extends CreateIncomeCategoryRequest {
  id: string;
}

export type CreateIncomeCategoryResponse = Pick<IncomeCategory, "id" | "name">;

export type UpdateIncomeCategoryResponse = Pick<IncomeCategory, "id" | "name">;

export interface AmountList {
  id: string;
  name: string;
  amount: number;
}

export interface IncomeListByCategory {
  userId: string;
  categoryId: string;
}