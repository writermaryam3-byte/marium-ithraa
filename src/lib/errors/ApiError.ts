import { ValidationErrors } from "../types/types";

export class ApiError extends Error {
    status: number;
    validationErrors?: ValidationErrors
  
    constructor(message: string, status: number, validationErrors?: ValidationErrors) {
      super(message);
      this.status = status;
      this.validationErrors = validationErrors||{}
    }
  }