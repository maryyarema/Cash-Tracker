import logger from "../utils/logger";
import { Expense, ExpenseCreationAttributes } from "../models/Expense";
import { ServiceResponse } from "../types/common";
import { InternalServerError } from "../utils/errorWrapper";

export default class ExpenseService {
  public static async list(
    userId: string
  ): Promise<ServiceResponse<Expense[]>> {
    try {
      // TODO: add category property to the response
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
}
