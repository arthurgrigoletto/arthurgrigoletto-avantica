import { StatusCodes } from 'http-status-codes';

class AppError {
  public readonly message: string;

  public readonly statusCode: StatusCodes;

  constructor(message: string, statusCode = StatusCodes.BAD_REQUEST) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
