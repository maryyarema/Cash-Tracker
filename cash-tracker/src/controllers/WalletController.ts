import { Context } from "koa";
import WalletService from "../services/WalletService";
import errorHandler from "../utils/errorHandler";

export default class WalletController {
  public static async getWallet(ctx: Context) {
    const { id } = ctx.state.user;

    const response = await WalletService.getWallet(id);
    errorHandler(ctx, response);

    ctx.body = response.data;
    ctx.status = 200;
  }
}
