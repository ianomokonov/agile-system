import { StatusCodes } from 'http-status-codes';

export class WebError extends Error {
  constructor(public statusCode: StatusCodes, public error: string) {
    super();
  }
}
