import config from "config";
import logger from "../utils/logger";
import { IncomeCategory } from "../models/IncomeCategory";
import { DeleteRequest, ServiceResponse } from "../types/common";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/errorWrapper";
import {
  AmountList,
  CreateIncomeCategoryRequest,
  CreateIncomeCategoryResponse,
  IncomeListByCategory,
  UpdateIncomeCategoryRequest,
  UpdateIncomeCategoryResponse,
} from "../types/IncomeCategory";
import { Income } from "../models";
import { Sequelize } from "sequelize";

const SYSTEM_NAME: string = config.get("INCOMES_AND_EXPENSES.SYSTEM_NAME");

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

  public static async update(
    data: UpdateIncomeCategoryRequest
  ): Promise<ServiceResponse<UpdateIncomeCategoryResponse>> {
    try {
      const { id, name, userId } = data;

      const [incomeCategory, existingIncomeCategory] = await Promise.all([
        IncomeCategory.findOne({
          attributes: ["id", "name"],
          where: {
            id,
            userId,
          },
        }),
        IncomeCategory.findOne({
          attributes: ["id"],
          where: {
            name,
            userId,
          },
        }),
      ]);

      if (!incomeCategory) {
        logger.error("Income category Not Found");
        return NotFoundError("Income category Not Found");
      }

      if (existingIncomeCategory) {
        logger.error("Income category already exists with the same name");
        return ConflictError(
          "Income category already exists with the same name"
        );
      }

      if (incomeCategory.name === SYSTEM_NAME) {
        logger.error("System income category can not be deleted");
        return ConflictError("System income category can not be updated");
      }

      await IncomeCategory.update(
        {
          name,
        },
        {
          where: {
            id,
            userId,
          },
        }
      );

      return {
        data: {
          id,
          name,
        },
      };
    } catch (error) {
      logger.error("Error while updating income category", error);
      return InternalServerError("Error while updating income category");
    }
  }

  public static async delete(
    data: DeleteRequest
  ): Promise<ServiceResponse<null>> {
    try {
      const { id, userId } = data;

      const incomeCategory = await IncomeCategory.findOne({
        attributes: ["id", "name"],
        where: {
          id,
          userId,
        },
      });

      if (!incomeCategory) {
        logger.error("Income category Not Found");
        return NotFoundError("Income category Not Found");
      }

      if (incomeCategory.name === SYSTEM_NAME) {
        logger.error("System income category can not be deleted");
        return ConflictError("System income category can not be deleted");
      }

      await Income.update(
        {
          categoryId: Sequelize.literal(
            `(SELECT id FROM income_categories WHERE name = '${SYSTEM_NAME}' AND user_id = '${userId}')`
          ),
        },
        {
          where: {
            categoryId: id,
            userId,
          },
        }
      );

      await IncomeCategory.destroy({
        where: {
          id,
          userId,
        },
      });

      return {
        data: null,
      };
    } catch (error) {
      logger.error("Error while deleting income category", error);
      return InternalServerError("Error while deleting income category");
    }
  }

  public static async amountList(
    userId: string
  ): Promise<ServiceResponse<AmountList[]>> {
    try {
      const expenseCategories = (await IncomeCategory.findAll({
        attributes: [
          "id",
          "name",
          [
            Sequelize.literal(`(
              SELECT SUM(amount)::float
              FROM incomes 
              WHERE category_id = "IncomeCategory"."id" AND user_id = '${userId}'
            )`),
            "amount",
          ],
        ],
        where: {
          userId,
        },
        include: {
          model: Income,
          as: "incomes",
          attributes: [],
          required: true,
        },
      })) as unknown as AmountList[];

      return {
        data: expenseCategories,
      };
    } catch (error) {
      logger.error("Error while getting income categories with amount", error);
      return InternalServerError(
        "Error while getting income categories with amoun"
      );
    }
  }

  public static async incomeListByCategory(
    data: IncomeListByCategory
  ): Promise<ServiceResponse<Income[]>> {
    try {
      const { userId, categoryId } = data;

      const incomes = await Income.findAll({
        attributes: [
          "id",
          "date",
          "type",
          "amount",
          "categoryId",
          "description",
        ],
        where: {
          userId,
          categoryId,
        },
        order: [["date", "DESC"]],
      });

      return {
        data: incomes,
      };
    } catch (error) {
      logger.error("Error while getting incomes by category", error);
      return InternalServerError("Error while getting incomes by category");
    }
  }
}
