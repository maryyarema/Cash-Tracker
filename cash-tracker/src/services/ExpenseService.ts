import logger from "../utils/logger";
import {
  ExpenseAttributes,
  ExpenseCreationAttributes,
} from "../models/Expense";
import { DeleteRequest, ServiceResponse } from "../types/common";
import { InternalServerError, NotFoundError } from "../utils/errorWrapper";
import { ExpenseCategory, Expense } from "../models";

export default class ExpenseService {
  public static async list(
    userId: string
  ): Promise<ServiceResponse<Expense[]>> {
    try {
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
        },
        include: [
          {
            model: ExpenseCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
        order: [["date", "DESC"]],
      });

      return {
        data: expenses,
      };
    } catch (error) {
      logger.error("Error while getting expenses", error);
      return InternalServerError("Error while getting expenses");
    }
  }

  public static async create(
    data: ExpenseCreationAttributes
  ): Promise<ServiceResponse<Expense>> {
    try {
      const { date, type, userId, amount, categoryId, description } = data;

      const category = await ExpenseCategory.findOne({
        where: {
          id: categoryId,
          userId,
        },
      });

      if (!category) {
        logger.error("Expense Category Not Found");
        return NotFoundError("Expense Category Not Found");
      }

      const expense = await Expense.create({
        date,
        type,
        userId,
        amount,
        categoryId,
        description,
      });

      return {
        data: expense,
      };
    } catch (error) {
      logger.error("Error while creating expense", error);
      return InternalServerError("Error while creating expense");
    }
  }

  public static async update(
    data: ExpenseAttributes
  ): Promise<ServiceResponse<Expense>> {
    try {
      const { id, date, type, userId, amount, categoryId, description } = data;

      const expense = await Expense.findOne({
        attributes: ["id"],
        where: {
          id,
          userId,
        },
      });

      if (!expense) {
        logger.error("Expense Not Found");
        return NotFoundError("Expense Not Found");
      }

      await expense.update({
        date,
        type,
        amount,
        categoryId,
        description,
      });

      return {
        data: expense,
      };
    } catch (error) {
      logger.error("Error while updating expense", error);
      return InternalServerError("Error while updating expense");
    }
  }

  public static async delete(
    data: DeleteRequest
  ): Promise<ServiceResponse<null>> {
    try {
      const { id, userId } = data;

      const expense = await Expense.findOne({
        attributes: ["id"],
        where: {
          id,
          userId,
        },
      });

      if (!expense) {
        logger.error("Expense Not Found");
        return NotFoundError("Expense Not Found");
      }

      await Expense.destroy({
        where: {
          id,
          userId,
        },
      });

      return {
        data: null,
      };
    } catch (error) {
      logger.error("Error while deleting expense", error);
      return InternalServerError("Error while deleting expense");
    }
  }
}
