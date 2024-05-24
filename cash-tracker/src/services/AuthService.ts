import logger from "../utils/logger";
import { User } from "../models/User";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  TokenValidityCheck,
} from "../types/Auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ServiceResponse } from "../types/common";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/errorWrapper";
import UserService from "./UserService";

// TODO: use redis instead of in-memory map
const userTokenMap = new Map();

export default class AuthService {
  public static generateJwtToken(userId: string): string {
    const secret = String(process.env.JWT_SECRET);
    const payload = { id: userId };
    const options = { expiresIn: "12h" };

    const token = jwt.sign(payload, secret, options);
    return token;
  }

  public static verifyJwtToken(token: string): JwtPayload | null {
    const secret = String(process.env.JWT_SECRET);

    try {
      const decoded = jwt.verify(token, secret);
      return decoded as JwtPayload;
    } catch (error) {
      logger.error("Error while verifying JWT token", error);
      return null;
    }
  }

  public static checkTokenValidity(data: TokenValidityCheck): boolean {
    const { userId, iat } = data;
    const cacheStorageToken = userTokenMap.get(userId);

    if (!cacheStorageToken) {
      return false;
    }

    return cacheStorageToken === iat;
  }

  public static async signup(
    data: SignupRequest
  ): Promise<ServiceResponse<SignupResponse>> {
    try {
      const { name, email, password } = data;

      const userExists = await User.findOne({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (userExists) {
        logger.error("User already exists");
        return ConflictError("User already exists");
      }

      const { salt, passwordHash } =
        UserService.generateSaltAndPasswordHash(password);

      const user = await UserService.create({
        name,
        email,
        salt,
        passwordHash,
      });

      return {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      logger.error("Error while signing up", error);
      return InternalServerError("Error while signing up");
    }
  }

  public static async login(
    data: LoginRequest
  ): Promise<ServiceResponse<LoginResponse>> {
    try {
      const { email, password } = data;

      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user) {
        logger.error("User not found");
        return NotFoundError("User not found");
      }

      const passwordCheck = await UserService.checkPassword({
        password,
        salt: user.salt,
        passwordHash: user.passwordHash,
      });

      if (!passwordCheck) {
        throw new Error("Wrong password");
      }

      const token = AuthService.generateJwtToken(user.id);

      const { iat } = jwt.decode(token) as JwtPayload;
      userTokenMap.set(user.id, iat);

      return {
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      };
    } catch (error) {
      logger.error("Error while logging in", error);
      return InternalServerError("Error while logging up");
    }
  }

  public static logout(id: string): ServiceResponse<null> {
    try {
      userTokenMap.delete(id);

      return {
        data: null,
      };
    } catch (error) {
      logger.error("Error while logging out", error);
      return InternalServerError("Error while logging out");
    }
  }
}
