import Router from "koa-router";
import WalletController from "../controllers/WalletController";
import authentication from "../middlewares/authentication";

export default class WalletRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/wallet",
      authentication,
      WalletController.getWallet
    );
    return router;
  };
}
