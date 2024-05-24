import { Context } from "koa";
import UserService from "../services/UserService";
import errorHandler from "../utils/errorHandler";

export default class UserController {
  public static async getWallet(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await UserService.getWallet(id);
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async getBalance(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await UserService.getBalance(id);
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }
}
