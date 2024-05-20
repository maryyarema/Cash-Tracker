import { IncomeCategory } from "../models/IncomeCategory";

export interface CreateIncomeCategoryRequest {
    name: string;
    userId: string;
}

export type CreateIncomeCategoryResponse = Pick<IncomeCategory, "id" | "name">;
