import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof MongooseError.ValidationError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation error',
        errors: Object.values(exception.errors).map((err) => err.message),
      });
      return;
    }

    if (exception instanceof MongooseError.CastError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid ${exception.path}: ${exception.value}`,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
