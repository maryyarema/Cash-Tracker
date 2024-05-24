import Router from "koa-router";
import AuthRouter from "./AuthRouter";
import HealthRouter from "./HealthRouter";
import IncomeRouter from "./IncomeRouter";
import UserRouter from "./UserRouter";
import ProfileRouter from "./ProfileRouter";
import ExpenseRouter from "./ExpenseRouter";
import IncomeCategoryRouter from "./IncomeCategoryRouter";
import ExpenseCategoryRouter from "./ExpenseCategoryRouter";


export function startRoutes(router: Router): Router {
  AuthRouter.init(router);
  UserRouter.init(router);
  HealthRouter.init(router);
  IncomeRouter.init(router);
  ExpenseRouter.init(router);
  ProfileRouter.init(router);
  IncomeCategoryRouter.init(router);
  ExpenseCategoryRouter.init(router);

  return router;
}
