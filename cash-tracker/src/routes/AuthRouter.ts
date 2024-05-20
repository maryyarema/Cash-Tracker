import Router from "koa-router";
import AuthController from "../controllers/AuthController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { signup, login } from "../schemas/auth";

export default class AuthRouter {
  public static init = (router: Router): Router => {
    router.post(
      "/signup",
      validator(signup),
      AuthController.signup
    );
    router.post(
      "/login",
      validator(login),
      AuthController.login
    );
    router.post(
      "/logout",
      authentication,
      AuthController.logout
    );
    return router;
  };
}
