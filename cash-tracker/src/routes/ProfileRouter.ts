import Router from "koa-router";
import validator from "../middlewares/validator";
import authentication from "../middlewares/authentication";
import ProfileController from "../controllers/ProfileController";
import { update, changePassword } from "../schemas/profile";

export default class ProfileRouter {
  public static init = (router: Router): Router => {
    router.get(
      "/profile", 
      authentication, 
      ProfileController.get
    );
    router.put(
      "/profile",
      authentication,
      validator(update),
      ProfileController.update
    );
    router.put(
      "/profile/password",
      authentication,
      validator(changePassword),
      ProfileController.changePassword
    );
    return router;
  };
}
