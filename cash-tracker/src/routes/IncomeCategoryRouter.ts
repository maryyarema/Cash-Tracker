import Router from "koa-router";
import IncomeCategoryController from "../controllers/IncomeCategoryController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { create, update } from "../schemas/incomeCategory";
import { validateUUIDPathParameter } from "../schemas/common";

export default class IncomeCategoryRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/income-categories",
      authentication,
      IncomeCategoryController.list
    );
    router.post(
      "/income-categories",
      authentication,
      validator(create),
      IncomeCategoryController.create
    );
    router.put(
      "/income-categories/:id",
      authentication,
      validator(update),
      IncomeCategoryController.update
    );
    router.delete(
      "/income-categories/:id",
      authentication,
      validator(validateUUIDPathParameter),
      IncomeCategoryController.delete
    );
    router.get(
      "/income-categories/amount",
      authentication,
      IncomeCategoryController.amountList
    );
    router.get(
      "/income-categories/:id/incomes",
      authentication,
      validator(validateUUIDPathParameter),
      IncomeCategoryController.incomeListByCategory
    );
    return router;
  };
}
