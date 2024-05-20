import { Context, Next } from "koa";
import logger from "../utils/logger";
import AuthService from "../services/AuthService";

export default function authentication(ctx: Context, next: Next) {
  try {
    const header = ctx.request.headers.authorization;
    if (!header) {
      throw new Error("No authorization header");
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw new Error("No token");
    }

    const decoded = AuthService.verifyJwtToken(token);
    if (!decoded) {
      throw new Error("Token verification failed");
    }

    const { id, iat } = decoded;
    if (!id) {
      throw new Error("No id in token");
    }

    const isValid = AuthService.checkTokenValidity({ userId: id, iat });
    if (!isValid) {
      throw new Error("Iat mismatch");
    }

    ctx.state.user = { id };
    return next();
  } catch (error) {
    logger.error("Token validation failed", error);
    return ctx.throw("Invalid token", 401);
  }
}
