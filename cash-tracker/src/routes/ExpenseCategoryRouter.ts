import Router from "koa-router";
import ExpenseCategoryController from "../controllers/ExpenseCategoryController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { create } from "../schemas/incomeCategory";

export default class ExpenseCategoryRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/expense-categories",
      authentication,
      ExpenseCategoryController.list
    );
    router.post(
      "/expense-categories",
      validator(create),
      authentication,
      ExpenseCategoryController.create
    );
    return router;
  };
}
