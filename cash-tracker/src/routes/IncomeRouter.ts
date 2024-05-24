import Router from "koa-router";
import IncomeController from "../controllers/IncomeController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { create, update } from "../schemas/income";
import { validateUUIDPathParameter } from "../schemas/common";

export default class IncomeRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/incomes",
      authentication,
      IncomeController.list
    );
    router.post(
      "/incomes",
      authentication,
      validator(create),
      IncomeController.create
    );
    router.put(
      "/incomes/:id",
      authentication,
      validator(update),
      IncomeController.update
    );
    router.delete(
      "/incomes/:id",
      authentication,
      validator(validateUUIDPathParameter),
      IncomeController.delete
    );
    return router;
  };
}
