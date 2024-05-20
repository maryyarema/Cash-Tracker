import Router from "koa-router";
import IncomeCategoryController from "../controllers/IncomeCategoryController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { create } from "../schemas/incomeCategory";

export default class IncomeCategoryRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/income-categories",
      authentication,
      IncomeCategoryController.list
    );
    router.post(
      "/income-categories",
      validator(create),
      authentication,
      IncomeCategoryController.create
    );
    return router;
  };
}
