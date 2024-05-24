import crypto from "node:crypto";
import config from "config";
import { Wallet, Balance, CheckPassword, Create } from "../types/User";
import { ServiceResponse } from "../types/common";
import { QueryTypes } from "sequelize";
import sequelize from "../utils/sequelize";
import logger from "../utils/logger";
import { InternalServerError } from "../utils/errorWrapper";
import { User } from "../models/User";
import { IncomeCategory, ExpenseCategory } from "../models";

const SYSTEM_NAME: string = config.get("INCOMES_AND_EXPENSES.SYSTEM_NAME");
const CRYPT_ITERATIONS: number = config.get("CRYPT_ITERATIONS");
const KEY_LENGTH: number = config.get("KEY_LENGTH");
const DIGEST: string = config.get("DIGEST");

export default class UserService {
  public static generateSaltAndPasswordHash(password: string) {
    try {
      const salt = crypto.randomBytes(128).toString("base64");

      const passwordHash = crypto.pbkdf2Sync(
        password,
        salt,
        CRYPT_ITERATIONS,
        KEY_LENGTH,
        DIGEST
      );

      return { salt, passwordHash };
    } catch (error) {
      throw new Error("Error while generating salt and password hash");
    }
  }

  public static checkPassword(data: CheckPassword): boolean {
    try {
      const { password, salt, passwordHash } = data;
      const passwordHashToCheck = crypto.pbkdf2Sync(
        password,
        salt,
        CRYPT_ITERATIONS,
        KEY_LENGTH,
        DIGEST
      );

      const result = Buffer.from(passwordHash).equals(
        Buffer.from(passwordHashToCheck)
      );

      return result;
    } catch (error) {
      throw new Error("Error while checking password");
    }
  }

  public static async create(data: Create): Promise<User> {
    try {
      const { name, email, salt, passwordHash } = data;

      const user = await User.create({
        name,
        salt,
        email,
        passwordHash,
      });

      await Promise.all([
        IncomeCategory.create({
          name: SYSTEM_NAME,
          userId: user.id,
        }),
        ExpenseCategory.create({
          name: SYSTEM_NAME,
          userId: user.id,
        }),
      ]);

      return user;
    } catch (error) {
      throw new Error("Error while creating user");
    }
  }

  public static async getWallet(id: string): Promise<ServiceResponse<Wallet>> {
    try {
      const incomeCash =
        "(SELECT COALESCE(SUM(amount), 0) ::float FROM incomes WHERE type = 'cash' AND user_id = :id)";
      const incomeCard =
        "(SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE type = 'card' AND user_id = :id)";
      const expenseCash =
        "(SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE type = 'cash' AND user_id = :id)";
      const expenseCard =
        "(SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE type = 'card' AND user_id = :id)";

      const { cash, card } = (await sequelize.query(
        `
          SELECT
            ${incomeCash} - ${expenseCash}::float AS cash,
            ${incomeCard} - ${expenseCard}::float AS card
        `,
        {
          replacements: { id },
          type: QueryTypes.SELECT,
          plain: true,
        }
      )) as Pick<Wallet, "cash" | "card">;

      return {
        data: {
          total: cash + card,
          cash: cash,
          card: card,
        },
      };
    } catch (error) {
      logger.error("Error while getting wallet", error);
      return InternalServerError("Error while getting wallet");
    }
  }

  public static async getBalance(
    id: string
  ): Promise<ServiceResponse<Balance>> {
    try {
      const { income, expense } = (await sequelize.query(
        `
          SELECT
            (SELECT COALESCE(SUM(amount), 0)::float FROM incomes WHERE user_id = :id) as income,
            (SELECT COALESCE(SUM(amount), 0)::float FROM expenses WHERE user_id = :id) as expense
        `,
        {
          replacements: { id },
          type: QueryTypes.SELECT,
          plain: true,
        }
      )) as Pick<Balance, "income" | "expense">;

      return {
        data: {
          income,
          expense,
          balance: income - expense,
        },
      };
    } catch (error) {
      logger.error("Error while getting wallet", error);
      return InternalServerError("Error while getting wallet");
    }
  }
}
