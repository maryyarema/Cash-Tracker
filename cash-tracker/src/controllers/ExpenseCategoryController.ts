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

  public static async update(ctx: Context) {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.params;
    const { name } = ctx.request.body;

    const response = await ExpenseCategoryService.update({
      id,
      name,
      userId,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async delete(ctx: Context) {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.params;

    const response = await ExpenseCategoryService.delete({
      id,
      userId,
    });
    errorHandler(ctx, response);

    ctx.status = 204;
  }

  public static async amountList(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await ExpenseCategoryService.amountList(id);
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async expenseListByCategory(ctx: Context) {
    const { id: userId } = ctx.state.user;
    const { id: categoryId } = ctx.params

    const response = await ExpenseCategoryService.expenseListByCategory({
      userId,
      categoryId,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }
}
