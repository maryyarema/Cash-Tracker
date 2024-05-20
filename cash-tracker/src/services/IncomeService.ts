import logger from "../utils/logger";
import { Income, IncomeCreationAttributes } from "../models/Income";
import { ServiceResponse } from "../types/common";
import { InternalServerError } from "../utils/errorWrapper";

export default class IncomeService {
  public static async list(userId: string): Promise<ServiceResponse<Income[]>> {
    try {
      // TODO: add category property to the response
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
        },
        order: [["date", "DESC"]],
      });

      return {
        data: incomes,
      };
    } catch (error) {
      logger.error("Error while getting incomes", error);
      return InternalServerError("Error while getting incomes");
    }
  }

  public static async create(
    data: IncomeCreationAttributes
  ): Promise<ServiceResponse<Income>> {
    try {
      const { date, type, userId, amount, categoryId, description } = data;

      const income = await Income.create({
        date,
        type,
        userId,
        amount,
        categoryId,
        description,
      });

      return {
        data: income,
      };
    } catch (error) {
      logger.error("Error while creating income", error);
      return InternalServerError("Error while creating income");
    }
  }
}
