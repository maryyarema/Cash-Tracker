import logger from "../utils/logger";
import { ExpenseCategory } from "../models/ExpenseCategory";
import { ServiceResponse } from "../types/common";
import {
  ConflictError,
  InternalServerError,
} from "../utils/errorWrapper";
import {
  CreateExpenseCategoryRequest,
  CreateExpenseCategoryResponse,
} from "../types/ExpenseCategory";

export default class ExpenseCategoryService {
  public static async list(
    userId: string
  ): Promise<ServiceResponse<ExpenseCategory[]>> {
    try {
      const expenseCategories = await ExpenseCategory.findAll({
        attributes: ["id", "name"],
        where: {
          userId,
        },
      });

      return {
        data: expenseCategories,
      };
    } catch (error) {
      logger.error("Error while getting expense categories", error);
      return InternalServerError("Error while getting expense categories");
    }
  }

  public static async create(
    data: CreateExpenseCategoryRequest
  ): Promise<ServiceResponse<CreateExpenseCategoryResponse>> {
    try {
      const { name, userId } = data;

      const existingExpenseCategory = await ExpenseCategory.findOne({
        attributes: ["id"],
        where: {
          name,
          userId,
        },
      });

      if (existingExpenseCategory) {
        logger.error("Expense category already exists");
        return ConflictError("Expense category already exists");
      }

      const expenseCategory = await ExpenseCategory.create({
        name,
        userId,
      });

      return {
        data: {
          id: expenseCategory.id,
          name: expenseCategory.name,
        },
      };
    } catch (error) {
      logger.error("Error while creating expense category", error);
      return InternalServerError("Error while creating expense category");
    }
  }
}
