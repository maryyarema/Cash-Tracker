import config from "config";
import logger from "../utils/logger";
import { ExpenseCategory } from "../models/ExpenseCategory";
import { DeleteRequest, ServiceResponse } from "../types/common";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/errorWrapper";
import {
  AmountList,
  CreateExpenseCategoryRequest,
  CreateExpenseCategoryResponse,
  ExpenseListByCategory,
  UpdateExpenseCategoryRequest,
  UpdateExpenseCategoryResponse,
} from "../types/ExpenseCategory";
import { Expense } from "../models";
import { Sequelize } from "sequelize";

const SYSTEM_NAME: string = config.get("INCOMES_AND_EXPENSES.SYSTEM_NAME");

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

  public static async update(
    data: UpdateExpenseCategoryRequest
  ): Promise<ServiceResponse<UpdateExpenseCategoryResponse>> {
    try {
      const { id, name, userId } = data;

      const [expenseCategory, existingExpenseCategory] = await Promise.all([
        ExpenseCategory.findOne({
          attributes: ["id", "name"],
          where: {
            id,
            userId,
          },
        }),
        ExpenseCategory.findOne({
          attributes: ["id"],
          where: {
            name,
            userId,
          },
        }),
      ]);

      if (!expenseCategory) {
        logger.error("Expense category Not Found");
        return NotFoundError("Expense category Not Found");
      }

      if (existingExpenseCategory) {
        logger.error("Expense category already exists with the same name");
        return ConflictError(
          "Expense category already exists with the same name"
        );
      }

      if (expenseCategory.name === SYSTEM_NAME) {
        logger.error("System expense category can not be deleted");
        return ConflictError("System expense category can not be updated");
      }

      await ExpenseCategory.update(
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
      logger.error("Error while updating expense category", error);
      return InternalServerError("Error while updating expense category");
    }
  }

  public static async delete(
    data: DeleteRequest
  ): Promise<ServiceResponse<null>> {
    try {
      const { id, userId } = data;

      const expenseCategory = await ExpenseCategory.findOne({
        attributes: ["id", "name"],
        where: {
          id,
          userId,
        },
      });

      if (!expenseCategory) {
        logger.error("Expense category Not Found");
        return NotFoundError("Expense category Not Found");
      }

      if (expenseCategory.name === SYSTEM_NAME) {
        logger.error("System expense category can not be deleted");
        return ConflictError("System expense category can not be deleted");
      }

      await Expense.update(
        {
          categoryId: Sequelize.literal(
            `(SELECT id FROM expense_categories WHERE name = '${SYSTEM_NAME}' AND user_id = '${userId}')`
          ),
        },
        {
          where: {
            categoryId: id,
            userId,
          },
        }
      );

      await ExpenseCategory.destroy({
        where: {
          id,
          userId,
        },
      });

      return {
        data: null,
      };
    } catch (error) {
      logger.error("Error while deleting expense category", error);
      return InternalServerError("Error while deleting expense category");
    }
  }

  public static async amountList(
    userId: string
  ): Promise<ServiceResponse<AmountList[]>> {
    try {
      const expenseCategories = (await ExpenseCategory.findAll({
        attributes: [
          "id",
          "name",
          [
            Sequelize.literal(`(
              SELECT SUM(amount)::float
              FROM expenses 
              WHERE category_id = "ExpenseCategory"."id" AND user_id = '${userId}'
            )`),
            "amount",
          ],
        ],
        where: {
          userId,
        },
        include: {
          model: Expense,
          as: "expenses",
          attributes: [],
          required: true,
        },
      })) as unknown as AmountList[];

      return {
        data: expenseCategories,
      };
    } catch (error) {
      logger.error("Error while getting expense categories with amount", error);
      return InternalServerError("Error while getting expense categories with amoun");
    }
  }

  public static async expenseListByCategory(
    data: ExpenseListByCategory
  ): Promise<ServiceResponse<Expense[]>> {
    try {
      const { userId, categoryId } = data;

      const expenses = await Expense.findAll({
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
        data: expenses,
      };
    } catch (error) {
      logger.error("Error while getting expenses by category", error);
      return InternalServerError("Error while getting expenses by category");
    }
  }
}
