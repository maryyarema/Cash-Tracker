import Router from "koa-router";
import HealthController from "../controllers/HealthController";

export default class HealthRouter {
  public static init(router: Router): Router {
    router.get("/health", HealthController.healthCheck);
    return router;
  }
}
