import { HttpException, HttpStatus } from '@nestjs/common';
import { ResultResponseStatus } from './enum/response-status.enum';

export class ResultException extends HttpException {
  constructor(status: ResultResponseStatus) {
    super(status.getMessage(), status.getCode() as HttpStatus);
  }
}
