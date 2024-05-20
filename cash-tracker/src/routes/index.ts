import Router from "koa-router";
import AuthRouter from "./AuthRouter";
import HealthRouter from "./HealthRouter";
import IncomeRouter from "./IncomeRouter";
import ExpenseRouter from "./ExpenseRouter";
import IncomeCategoryRouter from "./IncomeCategoryRouter";
import ExpenseCategoryRouter from "./ExpenseCategoryRouter";
import WalletRouter from "./WalletRouter";

export function startRoutes(router: Router): Router {
  AuthRouter.init(router);
  WalletRouter.init(router);
  HealthRouter.init(router);
  IncomeRouter.init(router);
  ExpenseRouter.init(router);
  IncomeCategoryRouter.init(router);
  ExpenseCategoryRouter.init(router);

  return router;
}
