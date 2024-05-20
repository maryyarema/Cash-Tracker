import logger from "../utils/logger";
import { IncomeCategory } from "../models/IncomeCategory";
import { ServiceResponse } from "../types/common";
import {
  ConflictError,
  InternalServerError,
} from "../utils/errorWrapper";
import {
  CreateIncomeCategoryRequest,
  CreateIncomeCategoryResponse,
} from "../types/IncomeCategory";

export default class IncomeCategoryService {
  public static async list(
    userId: string
  ): Promise<ServiceResponse<IncomeCategory[]>> {
    try {
      const incomeCategories = await IncomeCategory.findAll({
        attributes: ["id", "name"],
        where: {
          userId,
        },
      });

      return {
        data: incomeCategories,
      };
    } catch (error) {
      logger.error("Error while getting income categories", error);
      return InternalServerError("Error while getting income categories");
    }
  }

  public static async create(
    data: CreateIncomeCategoryRequest
  ): Promise<ServiceResponse<CreateIncomeCategoryResponse>> {
    try {
      const { name, userId } = data;

      const existingIncomeCategory = await IncomeCategory.findOne({
        attributes: ["id"],
        where: {
          name,
          userId,
        },
      });

      if (existingIncomeCategory) {
        logger.error("Income category already exists");
        return ConflictError("Income category already exists");
      }

      const incomeCategory = await IncomeCategory.create({
        name,
        userId,
      });

      return {
        data: {
          id: incomeCategory.id,
          name: incomeCategory.name,
        },
      };
    } catch (error) {
      logger.error("Error while creating income category", error);
      return InternalServerError("Error while creating income category");
    }
  }
}
