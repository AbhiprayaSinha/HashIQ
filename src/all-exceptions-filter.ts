import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const request = ctx.getRequest();
    const message = exception.message || exception.response.message || null;
    const logError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.response.message || exception.message || null,
      stack: exception.stack,
    };

    Logger.error(logError, 'AllExceptionsFilter');

    // Logger.log(exception.stack, 'AllExceptionsFilter');
    // console.dir(exception)

    // Source of the error
    // Logger.error(logError, 'AllExceptionsFilter');

    response.status(status).json({
      message,
      error: exception.response.error || exception.error || message,
    });
  }
}
