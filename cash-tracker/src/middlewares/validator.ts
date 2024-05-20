import Ajv from "ajv";
import AjvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";
import { Context, Next } from "koa";

import logger from "../utils/logger";

export default function validator(schema: any) {
  if (!schema) {
    throw new Error("schema must be provided");
  }

  const ajv = new Ajv({ allErrors: true });
  AjvErrors(ajv);
  addFormats(ajv);
  addKeywords(ajv);
  const validate: any = ajv.compile(schema);

  return async (ctx: Context, next: Next) => {
    if (!(ctx.request.body instanceof Object)) {
      logger.error("Input request body must be an object");
      return ctx.throw("Input request body must be an object", 422);
    }

    const data = { ...ctx.request.query, ...ctx.request.body, ...ctx.params };
    const isValid = validate(data);

    if (!isValid) {
      const { instancePath, message } = validate.errors[0];
      const errMessage = `${instancePath} : ${JSON.stringify(message)}`;
      ctx.throw(`${errMessage}`, 422);
    }

    await next();
  };
}
