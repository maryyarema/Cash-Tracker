import { Context } from "koa";
import { ServiceResponse } from "../types/common";

export default function errorHandler(ctx: Context, response: ServiceResponse) {
  if (response.error) {
    ctx.throw(response.error.message, response.error.code);
  }
}
