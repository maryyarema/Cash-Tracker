import { User } from "../models/User";

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Pick<User, "id" | "name" | "email">;
}

export interface TokenValidityCheck {
  userId: string;
  iat: number | undefined;
}

export type SignupResponse = Pick<User, "id" | "name" | "email">;
