import Router from "koa-router";
import ExpenseController from "../controllers/ExpenseController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { create } from "../schemas/expense";

export default class ExpenseRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/expenses",
      authentication,
      ExpenseController.list
    );
    router.post(
      "/expenses",
      validator(create),
      authentication,
      ExpenseController.create
    );
    return router;
  };
}
