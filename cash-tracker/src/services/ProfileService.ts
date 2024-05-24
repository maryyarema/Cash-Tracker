import logger from "../utils/logger";
import { ServiceResponse } from "../types/common";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/errorWrapper";
import { User } from "../models/User";
import { ChangePassword, UpdateProfile } from "../types/Profile";
import UserService from "./UserService";

export default class ProfileService {
  public static async get(userId: string): Promise<ServiceResponse<User>> {
    try {
      const user = await User.findOne({
        attributes: ["id", "name", "email"],
        where: {
          id: userId,
        },
      });

      if (!user) {
        logger.error("User Not Found");
        return NotFoundError("User Not Found");
      }

      return {
        data: user,
      };
    } catch (error) {
      logger.error("Error while getting profile", error);
      return InternalServerError("Error while getting profile");
    }
  }

  public static async update(
    data: UpdateProfile
  ): Promise<ServiceResponse<User>> {
    try {
      const { name, email, userId } = data;

      const user = await User.findOne({
        attributes: ["id", "name", "email"],
        where: {
          id: userId,
        },
      });

      if (!user) {
        logger.error("User Not Found");
        return NotFoundError("User Not Found");
      }

      if (email !== user.email) {
        const existingUser = await User.findOne({
          where: {
            email,
          },
        });

        if (existingUser) {
          logger.error("User with this email already exists");
          return BadRequestError("User with this email already exists");
        }
      }

      await user.update({
        name,
        email,
      });

      return {
        data: user,
      };
    } catch (error) {
      logger.error("Error while updating profile", error);
      return InternalServerError("Error while updating profile");
    }
  }

  public static async changePassword(
    data: ChangePassword
  ): Promise<ServiceResponse<null>> {
    try {
      const { userId, newPassword, currentPassword } = data;

      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        logger.error("User Not Found");
        return NotFoundError("User Not Found");
      }

      const passwordCheck = await UserService.checkPassword({
        salt: user.salt,
        password: currentPassword,
        passwordHash: user.passwordHash,
      });

      if (!passwordCheck) {
        logger.error("Current password is wrong");
        return BadRequestError("Current password is wrong");
      }

      const { salt, passwordHash } =
        UserService.generateSaltAndPasswordHash(newPassword);

      await user.update({
        salt,
        passwordHash,
      });

      return {
        data: null,
      };
    } catch (error) {
      logger.error("Error while changing password", error);
      return InternalServerError("Error while changing password");
    }
  }
}
