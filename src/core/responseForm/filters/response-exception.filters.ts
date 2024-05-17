import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResultException } from './../reponse.exception';

@Catch()
export class ResultExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.getErrorMessage(exception),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof ResultException) {
      return exception.message;
    }
    if (exception instanceof HttpException) {
      return exception.message;
    }
    return 'Internal server error';
  }
}
