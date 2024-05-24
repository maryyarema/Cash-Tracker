import Router from "koa-router";
import ExpenseCategoryController from "../controllers/ExpenseCategoryController";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import { create, update } from "../schemas/expenseCategory";
import { validateUUIDPathParameter } from "../schemas/common";

export default class ExpenseCategoryRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/expense-categories",
      authentication,
      ExpenseCategoryController.list
    );
    router.post(
      "/expense-categories",
      authentication,
      validator(create),
      ExpenseCategoryController.create
    );
    router.put(
      "/expense-categories/:id",
      authentication,
      validator(update),
      ExpenseCategoryController.update
    );
    router.delete(
      "/expense-categories/:id",
      authentication,
      validator(validateUUIDPathParameter),
      ExpenseCategoryController.delete
    );
    router.get(
      "/expense-categories/amount",
      authentication,
      ExpenseCategoryController.amountList
    );
    router.get(
      "/expense-categories/:id/expenses",
      authentication,
      validator(validateUUIDPathParameter),
      ExpenseCategoryController.expenseListByCategory
    );
    return router;
  };
}
