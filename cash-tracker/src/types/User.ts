export interface Create {
  name: string;
  email: string;
  salt: string;
  passwordHash: Buffer;
}

export interface CheckPassword {
  password: string;
  salt: string;
  passwordHash: Buffer;
}

export interface Wallet {
  cash: number;
  card: number;
  total: number;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}
