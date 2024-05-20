export interface ServiceError {
  message: string;
  code: number;
}

export interface ServiceResponse<T = any> {
  data?: T;
  error?: ServiceError;
}
