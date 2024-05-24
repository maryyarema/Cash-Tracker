import { Context } from "koa";
import ExpenseService from "../services/ExpenseService";
import errorHandler from "../utils/errorHandler";

export default class ExpenseController {
  public static async list(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await ExpenseService.list(id);
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async create(ctx: Context) {
    const { id: userId } = ctx.state.user;
    const { type, date, amount, categoryId, description } = ctx.request.body;

    const response = await ExpenseService.create({
      date,
      type,
      userId,
      amount,
      categoryId,
      description,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 201;
  }

  public static async update(ctx: Context) {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.params;
    const { date, type, amount, categoryId, description } = ctx.request.body;

    const response = await ExpenseService.update({
      id,
      date,
      type,
      userId,
      amount,
      categoryId,
      description,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async delete(ctx: Context) {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.params;

    const response = await ExpenseService.delete({
      id,
      userId,
    });
    errorHandler(ctx, response);

    ctx.status = 204;
  }
}
