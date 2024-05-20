import logger from "../utils/logger";
import { ServiceResponse } from "../types/common";
import { InternalServerError } from "../utils/errorWrapper";
import sequelize from "../utils/sequelize";
import { QueryTypes } from "sequelize";
import { Wallet } from "../types/Wallet";



export default class WalletService {
  public static async getWallet(id: string): Promise<ServiceResponse<Wallet>> {
    try {
      const incomeCash = "(SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE type = 'cash' AND user_id = :id)";
      const incomeCard = "(SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE type = 'card' AND user_id = :id)";
      const expenseCash = "(SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE type = 'cash' AND user_id = :id)";
      const expenseCard = "(SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE type = 'card' AND user_id = :id)";

      const { cash, card } = await sequelize.query(
        `
        SELECT
          ${incomeCash} - ${expenseCash} AS cash,
          ${incomeCard} - ${expenseCard} AS card
        `,
        {
          replacements: { id },
          type: QueryTypes.SELECT,
          plain: true,
        }
      ) as Partial<Wallet>;

      return {
        data: {
          total: Number(cash) + Number(card),
          cash: Number(cash),
          card: Number(card),
        },
      };
    } catch (error) {
      logger.error("Error while getting wallet", error);
      return InternalServerError("Error while getting wallet");
    }
  }
}
