import Router from "koa-router";
import ExpenseController from "../controllers/ExpenseController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { create, update } from "../schemas/expense";
import { validateUUIDPathParameter } from "../schemas/common";

export default class ExpenseRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/expenses",
      authentication,
      ExpenseController.list
    );
    router.post(
      "/expenses",
      authentication,
      validator(create),
      ExpenseController.create
    );
    router.put(
      "/expenses/:id",
      authentication,
      validator(update),
      ExpenseController.update
    );
    router.delete(
      "/expenses/:id",
      authentication,
      validator(validateUUIDPathParameter),
      ExpenseController.delete
    );
    return router;
  };
}
