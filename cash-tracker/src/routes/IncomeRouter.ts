import Router from "koa-router";
import IncomeController from "../controllers/IncomeController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { create } from "../schemas/income";

export default class IncomeRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/incomes",
      authentication,
      IncomeController.list
    );
    router.post(
      "/incomes",
      validator(create),
      authentication,
      IncomeController.create
    );
    return router;
  };
}
