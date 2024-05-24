import { ServiceError } from "../types/common";

export function BadRequestError(message: string): { error: ServiceError } {
  return {
    error: {
      code    : 400,
      message : message,
    },
  };
}

export function NotFoundError(message: string): { error: ServiceError } {
  return {
    error: {
      code    : 404,
      message : message,
    },
  };
}

export function ConflictError(message: string): { error: ServiceError } {
  return {
    error: {
      code    : 409,
      message : message,
    },
  };
}

export function InternalServerError(message: string): { error: ServiceError } {
  return {
    error: {
      code    : 500,
      message : message,
    },
  };
}
