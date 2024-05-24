import { Context } from "koa";
import errorHandler from "../utils/errorHandler";
import ProfileService from "../services/ProfileService";

export default class ProfileController {
  public static async get(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await ProfileService.get(id);
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async update(ctx: Context) {
    const { id: userId } = ctx.state.user;
    const { name, email } = ctx.request.body;

    const response = await ProfileService.update({
      name,
      email,
      userId,
    });
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }

  public static async changePassword(ctx: Context) {
    const { id: userId } = ctx.state.user;
    const { newPassword, currentPassword } = ctx.request.body;

    const response = await ProfileService.changePassword({
      userId,
      newPassword,
      currentPassword,
    });
    errorHandler(ctx, response);

    ctx.status = 204;
  }
}
