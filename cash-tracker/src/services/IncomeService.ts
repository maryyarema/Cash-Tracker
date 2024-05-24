import logger from "../utils/logger";
import { IncomeAttributes, IncomeCreationAttributes } from "../models/Income";
import { DeleteRequest, ServiceResponse } from "../types/common";
import { InternalServerError, NotFoundError } from "../utils/errorWrapper";
import { IncomeCategory, Income } from "../models";

export default class IncomeService {
  public static async list(userId: string): Promise<ServiceResponse<Income[]>> {
    try {
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
        include: [
          {
            model: IncomeCategory,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
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

      const incomeCategory = await IncomeCategory.findOne({
        where: {
          id: categoryId,
          userId,
        },
      });

      if (!incomeCategory) {
        logger.error("Income Category Not Found");
        return NotFoundError("Income Category Not Found");
      }

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

  public static async update(
    data: IncomeAttributes
  ): Promise<ServiceResponse<Income>> {
    try {
      const { id, date, type, userId, amount, categoryId, description } = data;

      const income = await Income.findOne({
        attributes: ["id"],
        where: {
          id,
          userId,
        },
      });

      if (!income) {
        logger.error("Income Not Found");
        return NotFoundError("Income Not Found");
      }

      await income.update({
        date,
        type,
        amount,
        categoryId,
        description,
      });

      return {
        data: income,
      };
    } catch (error) {
      logger.error("Error while updating income", error);
      return InternalServerError("Error while updating income");
    }
  }

  public static async delete(
    data: DeleteRequest
  ): Promise<ServiceResponse<null>> {
    try {
      const { id, userId } = data;

      const income = await Income.findOne({
        attributes: ["id"],
        where: {
          id,
          userId,
        },
      });

      if (!income) {
        logger.error("Income Not Found");
        return NotFoundError("Income Not Found");
      }

      await Income.destroy({
        where: {
          id,
          userId,
        },
      });

      return {
        data: null,
      };
    } catch (error) {
      logger.error("Error while deleting income", error);
      return InternalServerError("Error while deleting income");
    }
  }
}
