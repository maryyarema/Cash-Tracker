import { Context } from "koa";

export default class HealthController {
  public static healthCheck(ctx: Context): void {
    ctx.status = 200;
  }
}
