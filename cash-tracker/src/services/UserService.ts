import crypto from "node:crypto";
import config from "config";
import { CheckPassword } from "../types/User";

const CRYPT_ITERATIONS: number = config.get("CRYPT_ITERATIONS");
const KEY_LENGTH: number = config.get("KEY_LENGTH");
const DIGEST: string = config.get("DIGEST");

export default class UserService {
  public static generateSaltAndPasswordHash(password: string) {
    try {
      const salt = crypto.randomBytes(128).toString("base64");

      const passwordHash = crypto.pbkdf2Sync(
        password,
        salt,
        CRYPT_ITERATIONS,
        KEY_LENGTH,
        DIGEST
      );

      return { salt, passwordHash };
    } catch (error) {
      throw new Error("Error while generating salt and password hash");
    }
  }

  public static checkPassword(data: CheckPassword): boolean {
    try {
      const { password, salt, passwordHash } = data;
      const passwordHashToCheck = crypto.pbkdf2Sync(
        password,
        salt,
        CRYPT_ITERATIONS,
        KEY_LENGTH,
        DIGEST
      );

      const result = Buffer.from(passwordHash).equals(
        Buffer.from(passwordHashToCheck)
      );

      return result;
    } catch (error) {
      throw new Error("Error while checking password");
    }
  }
}
