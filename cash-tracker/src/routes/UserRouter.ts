import Router from "koa-router";
import UserController from "../controllers/UserController";
import authentication from "../middlewares/authentication";

export default class UserRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/users/wallet",
      authentication,
      UserController.getWallet
    );
    router.get(
      "/users/balance",
      authentication,
      UserController.getBalance
    );
    return router;
  };
}
