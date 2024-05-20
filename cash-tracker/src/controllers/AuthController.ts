import { Context } from "koa";
import AuthService from "../services/AuthService";
import errorHandler from "../utils/errorHandler";

export default class AuthController {
  public static async signup(ctx: Context) {
    const { name, email, password } = ctx.request.body;

    const response = await AuthService.signup({
      name,
      email,
      password,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 201;
  }

  public static async login(ctx: Context) {
    const { email, password } = ctx.request.body;

    const response = await AuthService.login({
      email,
      password,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async logout(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await AuthService.logout(id);
    errorHandler(ctx, response);

    ctx.status = 204;
  }
}
