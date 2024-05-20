export interface CheckPassword {
  password: string;
  salt: string;
  passwordHash: Buffer;
}
