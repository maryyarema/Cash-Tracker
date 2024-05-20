import { Context } from "koa";
import ExpenseCategoryService from "../services/ExpenseCategoryService";
import errorHandler from "../utils/errorHandler";

export default class ExpenseCategoryController {
  public static async list(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await ExpenseCategoryService.list(id);
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async create(ctx: Context) {
    const { id } = ctx.state.user;
    const { name } = ctx.request.body;

    const response = await ExpenseCategoryService.create({
      name,
      userId: id,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 201;
  }
}
