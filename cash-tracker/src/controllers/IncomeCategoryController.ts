import { Context } from "koa";
import IncomeCategoryService from "../services/IncomeCategoryService";
import errorHandler from "../utils/errorHandler";

export default class IncomeCategoryController {
  public static async list(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await IncomeCategoryService.list(id);
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async create(ctx: Context) {
    const { id } = ctx.state.user;
    const { name } = ctx.request.body;

    const response = await IncomeCategoryService.create({
      name,
      userId: id,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 201;
  }
}
